import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { AdminDto } from '../admin/admin.dto';
import { LoginDto, RefreshDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}

  @ApiOperation({ summary: 'Authenticates the admin with credentials' })
  @ApiBody({ description: 'The auth credentials', type: LoginDto })
  @ApiOkResponse({ description: 'Successfully logged in' })
  @ApiForbiddenResponse({ description: 'Incorrect email or password' })
  @ApiBadRequestResponse({ description: 'Missing required params in request' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurred' })
  /*--------------------------------------------------------*/
  /*   Handles the login of an Admin with credentials       */
  /*--------------------------------------------------------*/
  @Post('login')
  public Login(@Body() payload: LoginDto) {
    return this.AuthService.Login(payload);
  }

  @ApiOperation({ summary: 'Updates the Access Token using Refresh Token' })
  @ApiBody({ description: 'The refresh params', type: RefreshDto })
  @ApiOkResponse({ description: 'Access token refreshed' })
  @ApiUnauthorizedResponse({ description: 'Refresh token expired' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurred' })
  /*--------------------------------------------------------*/
  /*       Handles the refresh of the Access Token          */
  /*--------------------------------------------------------*/
  @Post('refresh')
  // @UseGuards(JWTAuthGuard)
  public Refresh(@Body() payload: RefreshDto): Promise<unknown> {
    return this.AuthService.Refresh(payload);
  }

  @ApiOperation({ summary: 'Initializes the auth credentials using params' })
  @ApiBody({ description: 'The new authenticated admin', type: AdminDto })
  @ApiOkResponse({ description: 'Successfully registered' })
  @ApiBadRequestResponse({ description: 'Missing required params in request' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurred' })
  /*--------------------------------------------------------*/
  /*        Handles new user Sign Up with auth init         */
  /*--------------------------------------------------------*/
  @Post('signup')
  public Signup(@Body() payload: AdminDto) {
    return this.AuthService.Signup(payload);
  }
}
