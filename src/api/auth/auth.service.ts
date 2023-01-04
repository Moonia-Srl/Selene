import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { AdminDto } from '../admin/admin.dto';
import { Admin } from '../admin/admin.entity';
import { AccessJwtOps, AccessPaylaod, RefreshJwtOps, RefreshPayload } from './auth.constants';
import { AuthDTO, LoginDto, RefreshDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly JwtService: JwtService,
    @InjectRepository(Admin) private readonly AdminRepo: Repository<Admin>,
  ) { }


  /**
   * Signs the Access Token and Refresh tokens with default configurations.
   * @param {Partial<Admin>} admin - The admin payload to be signed
   * @returns {Promise<[string, string]>} - The access & refresh token
   */
  private async GenerateTokens(admin: Partial<Admin>): Promise<[string, string]> {
    const access = await this.JwtService.signAsync({ ...admin, ...AccessPaylaod }, AccessJwtOps)
    const refresh = await this.JwtService.signAsync({ ...admin, ...RefreshPayload }, RefreshJwtOps)
    return [access, refresh]
  }

  /**
   * Creates a new admin in the Database with the hashed password.
   * @param {AdminDto} admin - The new admin to create
   * @returns {Promise<Admin>} - The newly created admin on the Database
   */
  public async Signup(admin: AdminDto): Promise<Admin> {
    // Destructure needed fields
    const { password, email, ...others } = admin;

    // Retrieve the existent admin with the email provided
    const exist = !!await this.AdminRepo.findOne({ where: { email } });
    if (exist) throw new BadRequestException("User already exist")

    // Hashes the password and creates a new entry in the database
    const hash = await bcrypt.hash(admin.password, await bcrypt.genSalt());
    await this.AdminRepo.insert({ ...others, email, payload: hash });

    // Returns the newly created entry
    return await this.AdminRepo.findOne({ where: { email } });
  }

  /**
   * Authenticates the admin via email and password, then generates access & refresh tokens
   * @param {LoginDto} payload - Email and password
   * @returns {Promise<AuthDTO<Admin>>}
   */
  public async Login(payload: LoginDto): Promise<AuthDTO<Admin>> {
    // Renames the password field to plaintext since its not the oone encrypted
    const { email, password: plaintext } = payload;

    // Retrieve the existent admin with the email provided
    const admin = await this.AdminRepo.findOne({ where: { email } });
    // If no admin is found, an error is returned
    if (admin === null) throw new BadRequestException('Incorrect email or password');

    // Checks that both password matches, if not throws an error
    const pswdMatches = await bcrypt.compare(plaintext, admin.payload);
    if (!pswdMatches) throw new ForbiddenException('Incorrect email or password');

    // Sign the Access Token for the identified Admin
    const [access, refresh] = await this.GenerateTokens({ id: admin.id });
    // Saves the Refresh Token to the database for later
    await this.AdminRepo.update({ id: admin.id }, { refreshToken: refresh });

    return { payload: admin, access, refresh }
  }

   /**
   * Validates the current refresh token, then generates a new pair of access and refresh token.
   * @param {RefreshDto} payload - The refresh token for the session
   * @returns {Promise<AuthDTO<Admin>>}
   */
  public async Refresh(payload: RefreshDto): Promise<AuthDTO<Admin>> {
    // Destructure needed fields
    const { refreshToken } = payload;

    // Retrieve the existent admin with the Refresh Token provided
    const admin = await this.AdminRepo.findOne({ where: { refreshToken } });
    if (!refreshToken || !admin) throw new UnauthorizedException("Refresh token expired")

    // Generates a new pair of token to be returned
    const [access, refresh] = await this.GenerateTokens({ id: admin.id })
    // Saves the Refresh Token to the database for later
    await this.AdminRepo.update({ id: admin.id }, { refreshToken: refresh });

    return { payload: admin, access, refresh }
  }
}
