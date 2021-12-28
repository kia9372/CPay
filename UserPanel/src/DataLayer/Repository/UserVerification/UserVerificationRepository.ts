import OperationResult from "../../../core/Operation/OperationResult";
import { IUserVerificationRepository } from "./IUserVerificationRepository";
import { UserVerificationEntitie } from "../../Context/UserVerification/UserVerification";
import { GetAllPagingModel } from "../../../DTO/Share/GetAllPaging";
import { FilterViewModel } from "../../../DTO/Common/FilterViewModel";
import { UserVerificationDetail } from "../../../DTO/UserVerification/user-verification-detail.model";
import { Status } from "../../../DTO/Common/Status.enum";
import { UserVerificationModel } from "../../../DTO/UserVerification/user-verification-model";
import UnitOfWork from "../UnitOfWork/UnitOfWork";
import UtilService from "../../../Utilities/Util";
import RedisKey from "../../../Utilities/Redis/RedisKey";
import Sms from "../../../Utilities/SMS/Sms";
import { UserVerificationResult } from "../../../DTO/UserVerification/verification-result";

export default class UserVerificationRepository implements IUserVerificationRepository {


    async getUServerificationInfo(items: FilterViewModel<any>): Promise<OperationResult<GetAllPagingModel<any>>> {

        try {

            const query: any = [];

            Object.keys(items.filters).forEach(key => {
                const value = items.filters[key as keyof any];
                if (key === 'name' && value) {
                    query.push({ name: { $regex: `(.*)${value}(.*)` } });
                } else if (key === 'symbol' && value) {
                    query.push({ symbol: { $regex: `(.*)${value}(.*)` } });
                }
            });

            let exchnageList = await UserVerificationEntitie.find(...query, {}, { sort: { createdAt: -1 } }).skip((items.page - 1) * items.pageSize)
                .limit(items.pageSize)

            let count = await UserVerificationEntitie.find({})
                .where("isDelete")
                .equals(false)
                .estimatedDocumentCount();

            return OperationResult.BuildSuccessResult<GetAllPagingModel<any>>("Get All data Paging", {
                data: exchnageList,
                count: count
            });

        } catch (error: any) {
            return OperationResult.BuildFailur(error.message);
        }


    }

    async getUServerificationById(userId: string): Promise<OperationResult<UserVerificationDetail>> {

        try {

            let userVerificationDetail = await UserVerificationEntitie.findOne({ userId: userId }, {}, { sort: { createdAt: -1 } })
                .populate("userId")

            if (userVerificationDetail) {
                return OperationResult.BuildSuccessResult('Operation Success', {
                    backImage: userVerificationDetail.backImage,
                    birthDate: userVerificationDetail.birthDate,
                    frontImage: userVerificationDetail.frontImage,
                    id: userVerificationDetail.id,
                    image: userVerificationDetail.image,
                    nationalName: userVerificationDetail.nationality,
                    selfieImage: userVerificationDetail.selfieImage,
                    status: userVerificationDetail.status,
                    typeVerification: userVerificationDetail.typeVerification,
                    createAt: userVerificationDetail.createdAt,
                    updateAd: userVerificationDetail.updateAt,
                    userInfo: {
                        confirmEmail: userVerificationDetail.userId.confirmEmail,
                        confirmPhoneNumber: userVerificationDetail.userId.confirmPhoneNumber,
                        email: userVerificationDetail.userId.email,
                        firstName: userVerificationDetail.userId.firstName,
                        lastName: userVerificationDetail.userId.lastName,
                        phoneNumber: userVerificationDetail.userId.phoneNumber,
                        userAvatar: userVerificationDetail.userId.avatar,
                        userId: userVerificationDetail.userId.id
                    }
                });
            }
            return OperationResult.BuildFailur("we can not find this user verification");

        } catch (error: any) {
            return OperationResult.BuildFailur(error.message);

        }


    }

    async setPhoneNumber(userId: string, phoneNumber: string): Promise<OperationResult<string>> {

        try {


            let userInfo = await UnitOfWork.userRepository.FindUserById(userId);

            if (userInfo.success) {

                let findUserByPhoneNmber = await UnitOfWork.userRepository
                    .FindUserByPhoneNmber(phoneNumber);

                if (findUserByPhoneNmber.success) {
                    if (findUserByPhoneNmber.result.id === userId) {

                        return OperationResult.BuildFailur("you are selected this phone number , please try an other number");

                    }

                    return OperationResult.BuildFailur("you can not select this phone number , this number selected by other user");

                }
                const generateCode = await UtilService.GerateHashCode(RedisKey.ConfirmPhoneNumber + userId);

                if (generateCode.success && generateCode.result) {

                    const sendSMS = await Sms.sendMessage('Confirm Phone Number', phoneNumber, generateCode.result.code)
                    if (sendSMS.success) {

                        return OperationResult.BuildSuccessResult('Success Send Code to Your Phone', generateCode.result?.hash);

                    }
                    return OperationResult.BuildFailur('we have a problem with send code yo your phone number , please try a few minute later');

                }

            }
            return OperationResult.BuildFailur('We can not find this user , please try with currect information');

        } catch (error: any) {
            return OperationResult.BuildFailur(error.message);
        }


    }

    async checkPhoneNumber(userId: string, code: string, hash: string, phoneNumber: string): Promise<OperationResult<boolean>> {

        try {

            const checkHashCode = await UtilService.CheckHashCode(RedisKey.ConfirmPhoneNumber + userId, code, hash)

            if (checkHashCode.success) {

                let findUserByPhoneNmber = await UnitOfWork.userRepository
                    .FindUserByPhoneNmber(phoneNumber);

                if (findUserByPhoneNmber.success) {
                    if (findUserByPhoneNmber.result.id === userId) {

                        return OperationResult.BuildFailur("you are selected this phone number , please try an other number");

                    }

                    return OperationResult.BuildFailur("you can not select this phone number , this number selected by other user");

                }

                const userchangePhoneNumberStatus = await UnitOfWork.userRepository
                    .ChangePhoneNumberStatus(userId, true, phoneNumber);

                if (userchangePhoneNumberStatus.success) {
                    return OperationResult.BuildSuccessResult("Success Set Phone Number", true);

                }
                return OperationResult.BuildFailur(checkHashCode.message);

            }

            return OperationResult.BuildFailur(checkHashCode.message);

        } catch (error: any) {
            return OperationResult.BuildFailur(error.message);
        }


    }

    async verification(userId: string, item: UserVerificationModel): Promise<OperationResult<UserVerificationResult>> {

        try {


            const userVerification = UserVerificationEntitie.build({
                backImage: item.backImage,
                birthDate: item.birthDate,
                frontImage: item.frontImage,
                image: item.image,
                userId: userId,
                nationality: item.nationality,
                selfieImage: item.selfieImage,
                status: Status.Pending,
                typeVerification: item.typeVerification
            });

            userVerification.save();
            return OperationResult.BuildSuccessResult("success send verification", {
                createdAt: userVerification.createdAt,
                id: userVerification.id,
                status: userVerification.status,
                type: userVerification.typeVerification,
                updatedAt: userVerification.updateAt
            });

        } catch (error: any) {
            return OperationResult.BuildFailur(error.message);
        }


    }

}