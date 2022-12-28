import { JWTAuthGuard } from '@botika/nestjs-auth';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AdminDto } from '../admin/admin.dto';
import { LoginDto, RefreshDto } from './auth.dto';
import { LoginService } from './auth.service';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly loginService: LoginService) {}

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
  public login(@Body() payload: LoginDto) {
    return this.loginService.login(payload);
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
  public refresh(@Body() payload: RefreshDto): Promise<unknown> {
    return this.loginService.refresh(payload);
  }

  @ApiOperation({ summary: 'Initializes the auth credentials using params' })
  @ApiBody({ description: 'The new authenticated admin', type: AdminDto })
  @ApiOkResponse({ description: 'Successfully registered' })
  @ApiForbiddenResponse({ description: 'Incorrect email or password' })
  @ApiBadRequestResponse({ description: 'Missing required params in request' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurred' })
  /*--------------------------------------------------------*/
  /*        Handles new user Sign Up with auth init         */
  /*--------------------------------------------------------*/
  @Post('signup')
  public signup(@Body() payload: AdminDto) {
    return this.loginService.signup(payload);
  }
}
