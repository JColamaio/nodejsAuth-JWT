import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users, UserDocument } from './schema/auth.schema';
import { hash, compare } from 'bcrypt'
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Users.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async register(userObject:RegisterAuthDto) {
    const { password } = userObject; //this is plain text, must hash it.
    const plainToHash = await hash(password, 10); // password crypt
    userObject = {... userObject, password: plainToHash}
    return this.userModel.create(userObject)

  }

  async login(userObjectLogin: LoginAuthDto) {
    const { email, password } = userObjectLogin;
    const findUser = await this.userModel.findOne({ email })
    if(!findUser) throw new HttpException('USER NOT FOUND', HttpStatus.NOT_FOUND);
    
      const checkPassword = await compare(password, findUser.password);

      if(!checkPassword) throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);

      const data = findUser

      return data
    }
  }

