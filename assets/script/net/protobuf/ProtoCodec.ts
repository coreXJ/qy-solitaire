// import protobuf from "./index";

// export default class ProtoCodec {
//     private static readonly cmdMap: { [key in protobuf.MsgId]: any } = {
//         [protobuf.MsgId.LOGIN]: protobuf.CSLogin,
//         [protobuf.MsgId.NULL]: undefined,
//         [protobuf.MsgId.CHECK_VERSION]: undefined,
//         [protobuf.MsgId.SAVE_DATA]: undefined,
//         [protobuf.MsgId.SYNC_DATA]: undefined,
//         [protobuf.MsgId.EVENT_REPORT]: undefined
//     }
//     public static test() {
//         let msg:protobuf.ICSLogin = {
//             openId: '123456',
//             platform: 1,
//             token: 'token111'
//         }
//         let data = protobuf.CSLogin.encode(msg).finish();
//         console.log('test ProtoCodec.encode',data);
//         console.log('test ProtoCodec.decode',protobuf.CSLogin.decode(data));
        
//     }
//     public static encode<T>(cmd: protobuf.MsgId, data: T):Uint8Array {
//         const cls = this.cmdMap[cmd];
//         const buffer = cls.encode(data).finish();
//         return buffer;
//     }
//     public static decode<T>(cmd: protobuf.MsgId, buffer: Uint8Array):T {
//         const cls = this.cmdMap[cmd];
//         const data = cls.decode(buffer);
//         return data;
//     }
// }