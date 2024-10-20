import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  profileInfo: {
    fullName?: string;
    nickname?: string;
    profileImage?: string;
    bio?: string;
  };
  accountStatus: {
    isVerified: boolean;
    isActive: boolean;
    registrationDate: Date;
    lastLoginDate?: Date;
  };
  activityMetrics: {
    totalLogins: number;
    totalVideoUploads: number;
    totalComments: number;
    totalLikes: number;
  };
  preferences: {
    language: string;
    theme: string;
    notifications: {
      email: boolean;
      push: boolean;
    };
  };
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  correctPassword(candidatePassword: string, userPassword: string): Promise<boolean>;
  createPasswordResetToken(): string;
}

interface IUserModel extends Model<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: [true, '사용자 이름은 필수입니다.'],
    unique: true,
    trim: true,
    minlength: [3, '사용자 이름은 최소 3자 이상이어야 합니다.'],
    maxlength: [20, '사용자 이름은 최대 20자까지 가능합니다.']
  },
  email: {
    type: String,
    required: [true, '이메일은 필수입니다.'],
    unique: true,
    lowercase: true,
    validate: {
      validator: function(v: string) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: '유효한 이메일 주소를 입력해주세요.'
    }
  },
  password: {
    type: String,
    required: [true, '비밀번호는 필수입니다.'],
    minlength: 8,
    select: false
  },
  profileInfo: {
    fullName: String,
    nickname: String,
    profileImage: String,
    bio: {
      type: String,
      maxlength: [200, '자기소개는 최대 200자까지 가능합니다.']
    }
  },
  accountStatus: {
    isVerified: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    },
    registrationDate: {
      type: Date,
      default: Date.now
    },
    lastLoginDate: Date
  },
  activityMetrics: {
    totalLogins: {
      type: Number,
      default: 0
    },
    totalVideoUploads: {
      type: Number,
      default: 0
    },
    totalComments: {
      type: Number,
      default: 0
    },
    totalLikes: {
      type: Number,
      default: 0
    }
  },
  preferences: {
    language: {
      type: String,
      default: 'ko'
    },
    theme: {
      type: String,
      default: 'light'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      }
    }
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.correctPassword = async function(
  candidatePassword: string,
  userPassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.createPasswordResetToken = function(): string {
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
  
  return resetToken;
};

userSchema.statics.findByEmail = function(email: string): Promise<IUser | null> {
  return this.findOne({ email });
};

userSchema.methods.createEmailVerificationToken = function(): string {
  const verificationToken = crypto.randomBytes(32).toString('hex');
  
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
  
  this.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  
  return verificationToken;
};

userSchema.virtual('fullName').get(function(this: IUser) {
  return `${this.profileInfo.fullName || ''} (${this.username})`;
});

userSchema.index({ username: 1, email: 1 });

const User = mongoose.model<IUser, IUserModel>('User', userSchema);
export default User;