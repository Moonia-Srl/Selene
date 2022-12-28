import { AuthService, TokenType } from '@botika/nestjs-auth';
import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminDto } from 'src/api/admin/admin.dto';
import { Repository } from 'typeorm';
import { Admin } from '../admin/admin.entity';
import { Auth, JwtPayload, LoginDto, RefreshDto } from './auth.dto';

@Injectable()
export class LoginService {
  constructor(
    private readonly authService: AuthService<JwtPayload>,
    @InjectRepository(Admin) private readonly adminRepo: Repository<Admin>
  ) {}

  private async getByLogin(payload: LoginDto): Promise<Partial<Admin>> {
    // Destructure the email and password fields from the payload
    const { email, password } = payload;

    // Retrieve the existent admin with the email provided
    const admin = await this.adminRepo.findOne({ where: { email } });
    // If no admin is found, an error is returned
    if (admin === null) throw new ForbiddenException('Incorrect email or password');

    // Checks that both password matches, if not throws an error
    const isSame = await this.authService.checkPassword(password, admin.payload);
    if (!isSame) throw new ForbiddenException('Incorrect email or password');

    return admin; // At last returns an error
  }

  /**
   * Handles the login a of an already existing user
   * @param {LoginDto} payload - Email and password
   * @returns {unknown}
   */
  public async login(payload: LoginDto): Promise<Auth<{ _id: string }>> {
    const admin = await this.getByLogin(payload);
    const toSign = { _id: admin.id.toString() };

    // Sign the Access Token for the identified Admin
    const accessToken = this.authService.signToken(toSign, TokenType.Access);
    // Sign the Refresh Token for the identified Admin
    const refreshToken = this.authService.signToken(toSign, TokenType.Refresh);

    // Saves the Refresh Token to the database for later
    await this.adminRepo.update({ id: admin.id }, { refreshToken });

    // Returns the authenticated payload plus the admin id
    return { accessToken, refreshToken, payload: toSign };
  }

  public async refresh(payload: RefreshDto): Promise<Auth<Admin>> {
    // Destructure the input payload
    const { refreshToken } = payload;

    // Retrieves the matching Admin entity in the database
    const admin = await this.adminRepo.findOne({ where: { refreshToken } });

    if (admin === null) throw new UnauthorizedException('User does not exists');

    // Signs a new Access Token that is then returned to the user
    const accessToken = this.authService.signToken(
      { _id: admin.id.toString() },
      TokenType.Refresh
    );
    return { accessToken, refreshToken, payload: admin };
  }

  public async signup(admin: AdminDto): Promise<Admin> {
    // Destructure needed fields
    const { password, email, ...others } = admin;

    // Hashes the password and creates a new entry in the database
    const hash = await this.authService.hashPassword(password);
    await this.adminRepo.insert({ ...others, email, payload: hash });

    // Returns the newly created entry
    return await this.adminRepo.findOne({ where: { email } });
  }
}
