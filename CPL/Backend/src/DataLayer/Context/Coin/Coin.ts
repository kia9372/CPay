import mongoose, { Schema } from 'mongoose';
import { ICoinAttrs } from './ICoinAttrs';
import { ICoinDoc } from './ICoinDoc';
import { ICoinModel } from './ICoinModel';
import { ICoinLocalItem } from './ICoinLocalItems';

const CoinSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    isDelete: { type: Boolean, default: false },
    symbol: {
        type: String,
        required: true
    },
    isPublish: { type: Boolean, require: true },
    icon: {
        type: String,
        required: true
    },
    networks: [
        {
            networkId:
            {
                type: Schema.Types.ObjectId,
                ref: 'Network',
            },
            contractAddress: {
                type: String,
                require: false
            },
            contractAbi: {
                type: String,
                require: false
            }
        }],
    locals:
        [{
            lang: { type: String },
            value: {
                name: { type: String },
                langId: { type: Schema.Types.ObjectId }
            }
        }]
}, {
    toJSON: { virtuals: true },
})


CoinSchema.statics.build = (attrs: ICoinAttrs) => {
    return new CoinEntitie(attrs);
}


const CoinEntitie = mongoose.model<ICoinDoc, ICoinModel>("Coin", CoinSchema);

export { CoinEntitie }