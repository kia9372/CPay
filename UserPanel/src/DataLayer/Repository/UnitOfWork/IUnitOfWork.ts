
import Websocket from "../../../Utilities/Websocket/Websocket";
import IAdminRepository from "../Admin/IAdminRepository";
import { ICoinRepository } from "../Coin/ICoinRepository";
import { IComissionRepository } from "../Comission/IComissionRepository";
import { ICurrencyPairRepository } from "../CurrencyPair/ICurrencyPairRepository";
import { IERC20NetworkRepository } from "../ERC20Network/IERC20Network";
import { IExchangeRepository } from "../Exchange/IExchangeRepository";
import { IGetwayTypeRepository } from "../GetwayType/IGetwayTypeRepository";
import { IJWTRepository } from "../JWT/IJWTRepository";
import { ILanguageRepository } from "../Language/ILanguageRepository";
import { ILoginRepository } from "../Login/ILoginRepository";
import { INetworkRepository } from "../Network/INetworkRepository";
import { INotificationRepository } from "../Notification/INotificationRepository";
import { IPermissionRepository } from "../Permission/IPermissionRepository";
import { IRoleRepository } from "../Role/IRoleRepository";
import { IRolePermissionRepository } from "../RolePermission/IRolePermissionRepository";
import { ISettingRepository } from "../Setting/ISettingRepository";
import IUserRepository from "../User/IUserRepository";
import { IUserActiveLevelRepository } from "../UserActiveLevel/IUserActiveLevelRepository";
import { IUserActivityRepository } from "../UserActivity/IUserActivityRepository";
import { IUserLevelRepository } from "../UserLevel/IUserLevelRepository";
import { IUserRoleRepository } from "../UserRole/IUserRoleRepository";
import { IUserVerificationRepository } from "../UserVerification/IUserVerificationRepository";
import UserVerificationRepository from "../UserVerification/UserVerificationRepository";
import { IWalletRepository } from "../Wallet/IWalletRepository";

export interface IUnitOfWork {

    adminRepository: IAdminRepository;
    userRepository: IUserRepository;
    jwtRepository: IJWTRepository;
    LoginRepository: ILoginRepository;
    NotificationRepository: INotificationRepository;
    RolePermissionRepository: IRolePermissionRepository;
    PermissionRepository: IPermissionRepository;
    RoleRepository: IRoleRepository;
    ExchangeRepository: IExchangeRepository;
    UserRoleRepository: IUserRoleRepository;
    SettingRepository: ISettingRepository;
    CoinRepository: ICoinRepository;
    CurrencyPairRepository: ICurrencyPairRepository;
    UserActivityRepositiry: IUserActivityRepository;
    UserLevelRepository: IUserLevelRepository;
    ComissionRepository: IComissionRepository;
    NetworkRepository: INetworkRepository;
    LanguageRepository: ILanguageRepository;
    GetwayTypeRepository: IGetwayTypeRepository;
    UserActiveLevelRepository: IUserActiveLevelRepository;
    UserVerification : IUserVerificationRepository;
    ERC20Network : IERC20NetworkRepository;
    websocket: Websocket;
    WalletRepository : IWalletRepository;

}