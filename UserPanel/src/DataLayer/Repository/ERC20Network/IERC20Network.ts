import OperationResult from "../../../core/Operation/OperationResult";
import { CreateWalletresultModel } from "../../../DTO/GRPC/Network/CreateWalletresultModel";

export interface IERC20NetworkRepository {
    CreateWallet(): Promise<OperationResult<CreateWalletresultModel>>;
}