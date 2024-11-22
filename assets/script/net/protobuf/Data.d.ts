// DO NOT EDIT! This is a generated file. Edit the JSDoc in src/*.js instead and run 'npm run build:types'.

/** Namespace GPBClass. */
export namespace GPBClass {

    /** Namespace Message. */
    namespace Message {

        /** MsgId enum. */
        enum MsgId {
            NULL = 0,
            CHECK_VERSION = 1,
            LOGIN = 2,
            SAVE_DATA = 3,
            SYNC_DATA = 4,
            EVENT_REPORT = 5
        }

        /** Platform enum. */
        enum Platform {
            GUEST = 0,
            GOOGLE = 1,
            FACEBOOK = 2,
            APPLE = 3,
            WECHAT = 4
        }

        /** Properties of a CSLogin. */
        interface ICSLogin {

            /** CSLogin openId */
            openId?: (string|null);

            /** CSLogin platform */
            platform?: (number|null);

            /** CSLogin token */
            token?: (string|null);

            /** CSLogin version */
            version?: (string|null);
        }

        /** Represents a CSLogin. */
        class CSLogin implements ICSLogin {

            /**
             * Constructs a new CSLogin.
             * @param [properties] Properties to set
             */
            constructor(properties?: GPBClass.Message.ICSLogin);

            /** CSLogin openId. */
            public openId: string;

            /** CSLogin platform. */
            public platform: number;

            /** CSLogin token. */
            public token: string;

            /** CSLogin version. */
            public version: string;

            /**
             * Creates a new CSLogin instance using the specified properties.
             * @param [properties] Properties to set
             * @returns CSLogin instance
             */
            public static create(properties?: GPBClass.Message.ICSLogin): GPBClass.Message.CSLogin;

            /**
             * Encodes the specified CSLogin message. Does not implicitly {@link GPBClass.Message.CSLogin.verify|verify} messages.
             * @param message CSLogin message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: GPBClass.Message.ICSLogin, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified CSLogin message, length delimited. Does not implicitly {@link GPBClass.Message.CSLogin.verify|verify} messages.
             * @param message CSLogin message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: GPBClass.Message.ICSLogin, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CSLogin message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CSLogin
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): GPBClass.Message.CSLogin;

            /**
             * Decodes a CSLogin message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns CSLogin
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): GPBClass.Message.CSLogin;

            /**
             * Verifies a CSLogin message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a CSLogin message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns CSLogin
             */
            public static fromObject(object: { [k: string]: any }): GPBClass.Message.CSLogin;

            /**
             * Creates a plain object from a CSLogin message. Also converts values to other types if specified.
             * @param message CSLogin
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: GPBClass.Message.CSLogin, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this CSLogin to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for CSLogin
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a SCLogin. */
        interface ISCLogin {

            /** SCLogin uid */
            uid?: (number|null);

            /** SCLogin openId */
            openId?: (string|null);

            /** SCLogin sessionId */
            sessionId?: (string|null);

            /** SCLogin regTime */
            regTime?: (number|Long|null);

            /** SCLogin loginType */
            loginType?: (number|null);
        }

        /** Represents a SCLogin. */
        class SCLogin implements ISCLogin {

            /**
             * Constructs a new SCLogin.
             * @param [properties] Properties to set
             */
            constructor(properties?: GPBClass.Message.ISCLogin);

            /** SCLogin uid. */
            public uid: number;

            /** SCLogin openId. */
            public openId: string;

            /** SCLogin sessionId. */
            public sessionId: string;

            /** SCLogin regTime. */
            public regTime: (number|Long);

            /** SCLogin loginType. */
            public loginType: number;

            /**
             * Creates a new SCLogin instance using the specified properties.
             * @param [properties] Properties to set
             * @returns SCLogin instance
             */
            public static create(properties?: GPBClass.Message.ISCLogin): GPBClass.Message.SCLogin;

            /**
             * Encodes the specified SCLogin message. Does not implicitly {@link GPBClass.Message.SCLogin.verify|verify} messages.
             * @param message SCLogin message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: GPBClass.Message.ISCLogin, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified SCLogin message, length delimited. Does not implicitly {@link GPBClass.Message.SCLogin.verify|verify} messages.
             * @param message SCLogin message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: GPBClass.Message.ISCLogin, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a SCLogin message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns SCLogin
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): GPBClass.Message.SCLogin;

            /**
             * Decodes a SCLogin message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns SCLogin
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): GPBClass.Message.SCLogin;

            /**
             * Verifies a SCLogin message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a SCLogin message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns SCLogin
             */
            public static fromObject(object: { [k: string]: any }): GPBClass.Message.SCLogin;

            /**
             * Creates a plain object from a SCLogin message. Also converts values to other types if specified.
             * @param message SCLogin
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: GPBClass.Message.SCLogin, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this SCLogin to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for SCLogin
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a CSSaveData. */
        interface ICSSaveData {

            /** CSSaveData userData */
            userData?: (GPBClass.Message.IUserData[]|null);
        }

        /** Represents a CSSaveData. */
        class CSSaveData implements ICSSaveData {

            /**
             * Constructs a new CSSaveData.
             * @param [properties] Properties to set
             */
            constructor(properties?: GPBClass.Message.ICSSaveData);

            /** CSSaveData userData. */
            public userData: GPBClass.Message.IUserData[];

            /**
             * Creates a new CSSaveData instance using the specified properties.
             * @param [properties] Properties to set
             * @returns CSSaveData instance
             */
            public static create(properties?: GPBClass.Message.ICSSaveData): GPBClass.Message.CSSaveData;

            /**
             * Encodes the specified CSSaveData message. Does not implicitly {@link GPBClass.Message.CSSaveData.verify|verify} messages.
             * @param message CSSaveData message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: GPBClass.Message.ICSSaveData, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified CSSaveData message, length delimited. Does not implicitly {@link GPBClass.Message.CSSaveData.verify|verify} messages.
             * @param message CSSaveData message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: GPBClass.Message.ICSSaveData, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CSSaveData message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CSSaveData
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): GPBClass.Message.CSSaveData;

            /**
             * Decodes a CSSaveData message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns CSSaveData
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): GPBClass.Message.CSSaveData;

            /**
             * Verifies a CSSaveData message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a CSSaveData message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns CSSaveData
             */
            public static fromObject(object: { [k: string]: any }): GPBClass.Message.CSSaveData;

            /**
             * Creates a plain object from a CSSaveData message. Also converts values to other types if specified.
             * @param message CSSaveData
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: GPBClass.Message.CSSaveData, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this CSSaveData to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for CSSaveData
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a SCSaveData. */
        interface ISCSaveData {
        }

        /** Represents a SCSaveData. */
        class SCSaveData implements ISCSaveData {

            /**
             * Constructs a new SCSaveData.
             * @param [properties] Properties to set
             */
            constructor(properties?: GPBClass.Message.ISCSaveData);

            /**
             * Creates a new SCSaveData instance using the specified properties.
             * @param [properties] Properties to set
             * @returns SCSaveData instance
             */
            public static create(properties?: GPBClass.Message.ISCSaveData): GPBClass.Message.SCSaveData;

            /**
             * Encodes the specified SCSaveData message. Does not implicitly {@link GPBClass.Message.SCSaveData.verify|verify} messages.
             * @param message SCSaveData message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: GPBClass.Message.ISCSaveData, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified SCSaveData message, length delimited. Does not implicitly {@link GPBClass.Message.SCSaveData.verify|verify} messages.
             * @param message SCSaveData message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: GPBClass.Message.ISCSaveData, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a SCSaveData message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns SCSaveData
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): GPBClass.Message.SCSaveData;

            /**
             * Decodes a SCSaveData message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns SCSaveData
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): GPBClass.Message.SCSaveData;

            /**
             * Verifies a SCSaveData message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a SCSaveData message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns SCSaveData
             */
            public static fromObject(object: { [k: string]: any }): GPBClass.Message.SCSaveData;

            /**
             * Creates a plain object from a SCSaveData message. Also converts values to other types if specified.
             * @param message SCSaveData
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: GPBClass.Message.SCSaveData, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this SCSaveData to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for SCSaveData
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a CSSyncData. */
        interface ICSSyncData {
        }

        /** Represents a CSSyncData. */
        class CSSyncData implements ICSSyncData {

            /**
             * Constructs a new CSSyncData.
             * @param [properties] Properties to set
             */
            constructor(properties?: GPBClass.Message.ICSSyncData);

            /**
             * Creates a new CSSyncData instance using the specified properties.
             * @param [properties] Properties to set
             * @returns CSSyncData instance
             */
            public static create(properties?: GPBClass.Message.ICSSyncData): GPBClass.Message.CSSyncData;

            /**
             * Encodes the specified CSSyncData message. Does not implicitly {@link GPBClass.Message.CSSyncData.verify|verify} messages.
             * @param message CSSyncData message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: GPBClass.Message.ICSSyncData, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified CSSyncData message, length delimited. Does not implicitly {@link GPBClass.Message.CSSyncData.verify|verify} messages.
             * @param message CSSyncData message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: GPBClass.Message.ICSSyncData, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CSSyncData message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CSSyncData
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): GPBClass.Message.CSSyncData;

            /**
             * Decodes a CSSyncData message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns CSSyncData
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): GPBClass.Message.CSSyncData;

            /**
             * Verifies a CSSyncData message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a CSSyncData message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns CSSyncData
             */
            public static fromObject(object: { [k: string]: any }): GPBClass.Message.CSSyncData;

            /**
             * Creates a plain object from a CSSyncData message. Also converts values to other types if specified.
             * @param message CSSyncData
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: GPBClass.Message.CSSyncData, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this CSSyncData to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for CSSyncData
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a SCSyncData. */
        interface ISCSyncData {

            /** SCSyncData userData */
            userData?: (GPBClass.Message.IUserData[]|null);
        }

        /** Represents a SCSyncData. */
        class SCSyncData implements ISCSyncData {

            /**
             * Constructs a new SCSyncData.
             * @param [properties] Properties to set
             */
            constructor(properties?: GPBClass.Message.ISCSyncData);

            /** SCSyncData userData. */
            public userData: GPBClass.Message.IUserData[];

            /**
             * Creates a new SCSyncData instance using the specified properties.
             * @param [properties] Properties to set
             * @returns SCSyncData instance
             */
            public static create(properties?: GPBClass.Message.ISCSyncData): GPBClass.Message.SCSyncData;

            /**
             * Encodes the specified SCSyncData message. Does not implicitly {@link GPBClass.Message.SCSyncData.verify|verify} messages.
             * @param message SCSyncData message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: GPBClass.Message.ISCSyncData, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified SCSyncData message, length delimited. Does not implicitly {@link GPBClass.Message.SCSyncData.verify|verify} messages.
             * @param message SCSyncData message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: GPBClass.Message.ISCSyncData, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a SCSyncData message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns SCSyncData
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): GPBClass.Message.SCSyncData;

            /**
             * Decodes a SCSyncData message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns SCSyncData
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): GPBClass.Message.SCSyncData;

            /**
             * Verifies a SCSyncData message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a SCSyncData message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns SCSyncData
             */
            public static fromObject(object: { [k: string]: any }): GPBClass.Message.SCSyncData;

            /**
             * Creates a plain object from a SCSyncData message. Also converts values to other types if specified.
             * @param message SCSyncData
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: GPBClass.Message.SCSyncData, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this SCSyncData to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for SCSyncData
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a CSEventReport. */
        interface ICSEventReport {

            /** CSEventReport event */
            event?: (string|null);

            /** CSEventReport data */
            data?: (string|null);

            /** CSEventReport afid */
            afid?: (string|null);

            /** CSEventReport version */
            version?: (string|null);
        }

        /** Represents a CSEventReport. */
        class CSEventReport implements ICSEventReport {

            /**
             * Constructs a new CSEventReport.
             * @param [properties] Properties to set
             */
            constructor(properties?: GPBClass.Message.ICSEventReport);

            /** CSEventReport event. */
            public event: string;

            /** CSEventReport data. */
            public data: string;

            /** CSEventReport afid. */
            public afid: string;

            /** CSEventReport version. */
            public version: string;

            /**
             * Creates a new CSEventReport instance using the specified properties.
             * @param [properties] Properties to set
             * @returns CSEventReport instance
             */
            public static create(properties?: GPBClass.Message.ICSEventReport): GPBClass.Message.CSEventReport;

            /**
             * Encodes the specified CSEventReport message. Does not implicitly {@link GPBClass.Message.CSEventReport.verify|verify} messages.
             * @param message CSEventReport message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: GPBClass.Message.ICSEventReport, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified CSEventReport message, length delimited. Does not implicitly {@link GPBClass.Message.CSEventReport.verify|verify} messages.
             * @param message CSEventReport message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: GPBClass.Message.ICSEventReport, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CSEventReport message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CSEventReport
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): GPBClass.Message.CSEventReport;

            /**
             * Decodes a CSEventReport message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns CSEventReport
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): GPBClass.Message.CSEventReport;

            /**
             * Verifies a CSEventReport message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a CSEventReport message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns CSEventReport
             */
            public static fromObject(object: { [k: string]: any }): GPBClass.Message.CSEventReport;

            /**
             * Creates a plain object from a CSEventReport message. Also converts values to other types if specified.
             * @param message CSEventReport
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: GPBClass.Message.CSEventReport, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this CSEventReport to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for CSEventReport
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a SCEventReport. */
        interface ISCEventReport {
        }

        /** Represents a SCEventReport. */
        class SCEventReport implements ISCEventReport {

            /**
             * Constructs a new SCEventReport.
             * @param [properties] Properties to set
             */
            constructor(properties?: GPBClass.Message.ISCEventReport);

            /**
             * Creates a new SCEventReport instance using the specified properties.
             * @param [properties] Properties to set
             * @returns SCEventReport instance
             */
            public static create(properties?: GPBClass.Message.ISCEventReport): GPBClass.Message.SCEventReport;

            /**
             * Encodes the specified SCEventReport message. Does not implicitly {@link GPBClass.Message.SCEventReport.verify|verify} messages.
             * @param message SCEventReport message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: GPBClass.Message.ISCEventReport, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified SCEventReport message, length delimited. Does not implicitly {@link GPBClass.Message.SCEventReport.verify|verify} messages.
             * @param message SCEventReport message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: GPBClass.Message.ISCEventReport, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a SCEventReport message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns SCEventReport
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): GPBClass.Message.SCEventReport;

            /**
             * Decodes a SCEventReport message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns SCEventReport
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): GPBClass.Message.SCEventReport;

            /**
             * Verifies a SCEventReport message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a SCEventReport message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns SCEventReport
             */
            public static fromObject(object: { [k: string]: any }): GPBClass.Message.SCEventReport;

            /**
             * Creates a plain object from a SCEventReport message. Also converts values to other types if specified.
             * @param message SCEventReport
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: GPBClass.Message.SCEventReport, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this SCEventReport to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for SCEventReport
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a UserData. */
        interface IUserData {

            /** UserData dataType */
            dataType?: (string|null);

            /** UserData seriType */
            seriType?: (string|null);

            /** UserData content */
            content?: (string|null);
        }

        /** Represents a UserData. */
        class UserData implements IUserData {

            /**
             * Constructs a new UserData.
             * @param [properties] Properties to set
             */
            constructor(properties?: GPBClass.Message.IUserData);

            /** UserData dataType. */
            public dataType: string;

            /** UserData seriType. */
            public seriType: string;

            /** UserData content. */
            public content: string;

            /**
             * Creates a new UserData instance using the specified properties.
             * @param [properties] Properties to set
             * @returns UserData instance
             */
            public static create(properties?: GPBClass.Message.IUserData): GPBClass.Message.UserData;

            /**
             * Encodes the specified UserData message. Does not implicitly {@link GPBClass.Message.UserData.verify|verify} messages.
             * @param message UserData message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: GPBClass.Message.IUserData, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified UserData message, length delimited. Does not implicitly {@link GPBClass.Message.UserData.verify|verify} messages.
             * @param message UserData message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: GPBClass.Message.IUserData, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a UserData message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns UserData
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): GPBClass.Message.UserData;

            /**
             * Decodes a UserData message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns UserData
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): GPBClass.Message.UserData;

            /**
             * Verifies a UserData message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a UserData message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns UserData
             */
            public static fromObject(object: { [k: string]: any }): GPBClass.Message.UserData;

            /**
             * Creates a plain object from a UserData message. Also converts values to other types if specified.
             * @param message UserData
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: GPBClass.Message.UserData, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this UserData to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for UserData
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }
    }
}
