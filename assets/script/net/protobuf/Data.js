/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal.js");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.GPBClass = (function() {

    /**
     * Namespace GPBClass.
     * @exports GPBClass
     * @namespace
     */
    var GPBClass = {};

    GPBClass.Message = (function() {

        /**
         * Namespace Message.
         * @memberof GPBClass
         * @namespace
         */
        var Message = {};

        /**
         * MsgId enum.
         * @name GPBClass.Message.MsgId
         * @enum {number}
         * @property {number} NULL=0 NULL value
         * @property {number} CHECK_VERSION=1 CHECK_VERSION value
         * @property {number} LOGIN=2 LOGIN value
         * @property {number} SAVE_DATA=3 SAVE_DATA value
         * @property {number} SYNC_DATA=4 SYNC_DATA value
         * @property {number} EVENT_REPORT=5 EVENT_REPORT value
         */
        Message.MsgId = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "NULL"] = 0;
            values[valuesById[1] = "CHECK_VERSION"] = 1;
            values[valuesById[2] = "LOGIN"] = 2;
            values[valuesById[3] = "SAVE_DATA"] = 3;
            values[valuesById[4] = "SYNC_DATA"] = 4;
            values[valuesById[5] = "EVENT_REPORT"] = 5;
            return values;
        })();

        /**
         * Platform enum.
         * @name GPBClass.Message.Platform
         * @enum {number}
         * @property {number} GUEST=0 GUEST value
         * @property {number} GOOGLE=1 GOOGLE value
         * @property {number} FACEBOOK=2 FACEBOOK value
         * @property {number} APPLE=3 APPLE value
         * @property {number} WECHAT=4 WECHAT value
         */
        Message.Platform = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "GUEST"] = 0;
            values[valuesById[1] = "GOOGLE"] = 1;
            values[valuesById[2] = "FACEBOOK"] = 2;
            values[valuesById[3] = "APPLE"] = 3;
            values[valuesById[4] = "WECHAT"] = 4;
            return values;
        })();

        Message.CSLogin = (function() {

            /**
             * Properties of a CSLogin.
             * @memberof GPBClass.Message
             * @interface ICSLogin
             * @property {string|null} [openId] CSLogin openId
             * @property {number|null} [platform] CSLogin platform
             * @property {string|null} [token] CSLogin token
             * @property {string|null} [version] CSLogin version
             */

            /**
             * Constructs a new CSLogin.
             * @memberof GPBClass.Message
             * @classdesc Represents a CSLogin.
             * @implements ICSLogin
             * @constructor
             * @param {GPBClass.Message.ICSLogin=} [properties] Properties to set
             */
            function CSLogin(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * CSLogin openId.
             * @member {string} openId
             * @memberof GPBClass.Message.CSLogin
             * @instance
             */
            CSLogin.prototype.openId = "";

            /**
             * CSLogin platform.
             * @member {number} platform
             * @memberof GPBClass.Message.CSLogin
             * @instance
             */
            CSLogin.prototype.platform = 0;

            /**
             * CSLogin token.
             * @member {string} token
             * @memberof GPBClass.Message.CSLogin
             * @instance
             */
            CSLogin.prototype.token = "";

            /**
             * CSLogin version.
             * @member {string} version
             * @memberof GPBClass.Message.CSLogin
             * @instance
             */
            CSLogin.prototype.version = "";

            /**
             * Creates a new CSLogin instance using the specified properties.
             * @function create
             * @memberof GPBClass.Message.CSLogin
             * @static
             * @param {GPBClass.Message.ICSLogin=} [properties] Properties to set
             * @returns {GPBClass.Message.CSLogin} CSLogin instance
             */
            CSLogin.create = function create(properties) {
                return new CSLogin(properties);
            };

            /**
             * Encodes the specified CSLogin message. Does not implicitly {@link GPBClass.Message.CSLogin.verify|verify} messages.
             * @function encode
             * @memberof GPBClass.Message.CSLogin
             * @static
             * @param {GPBClass.Message.ICSLogin} message CSLogin message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CSLogin.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.openId != null && Object.hasOwnProperty.call(message, "openId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.openId);
                if (message.platform != null && Object.hasOwnProperty.call(message, "platform"))
                    writer.uint32(/* id 2, wireType 0 =*/16).int32(message.platform);
                if (message.token != null && Object.hasOwnProperty.call(message, "token"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.token);
                if (message.version != null && Object.hasOwnProperty.call(message, "version"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.version);
                return writer;
            };

            /**
             * Encodes the specified CSLogin message, length delimited. Does not implicitly {@link GPBClass.Message.CSLogin.verify|verify} messages.
             * @function encodeDelimited
             * @memberof GPBClass.Message.CSLogin
             * @static
             * @param {GPBClass.Message.ICSLogin} message CSLogin message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CSLogin.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a CSLogin message from the specified reader or buffer.
             * @function decode
             * @memberof GPBClass.Message.CSLogin
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {GPBClass.Message.CSLogin} CSLogin
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CSLogin.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GPBClass.Message.CSLogin();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.openId = reader.string();
                            break;
                        }
                    case 2: {
                            message.platform = reader.int32();
                            break;
                        }
                    case 3: {
                            message.token = reader.string();
                            break;
                        }
                    case 4: {
                            message.version = reader.string();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a CSLogin message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof GPBClass.Message.CSLogin
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {GPBClass.Message.CSLogin} CSLogin
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CSLogin.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a CSLogin message.
             * @function verify
             * @memberof GPBClass.Message.CSLogin
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            CSLogin.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.openId != null && message.hasOwnProperty("openId"))
                    if (!$util.isString(message.openId))
                        return "openId: string expected";
                if (message.platform != null && message.hasOwnProperty("platform"))
                    if (!$util.isInteger(message.platform))
                        return "platform: integer expected";
                if (message.token != null && message.hasOwnProperty("token"))
                    if (!$util.isString(message.token))
                        return "token: string expected";
                if (message.version != null && message.hasOwnProperty("version"))
                    if (!$util.isString(message.version))
                        return "version: string expected";
                return null;
            };

            /**
             * Creates a CSLogin message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof GPBClass.Message.CSLogin
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {GPBClass.Message.CSLogin} CSLogin
             */
            CSLogin.fromObject = function fromObject(object) {
                if (object instanceof $root.GPBClass.Message.CSLogin)
                    return object;
                var message = new $root.GPBClass.Message.CSLogin();
                if (object.openId != null)
                    message.openId = String(object.openId);
                if (object.platform != null)
                    message.platform = object.platform | 0;
                if (object.token != null)
                    message.token = String(object.token);
                if (object.version != null)
                    message.version = String(object.version);
                return message;
            };

            /**
             * Creates a plain object from a CSLogin message. Also converts values to other types if specified.
             * @function toObject
             * @memberof GPBClass.Message.CSLogin
             * @static
             * @param {GPBClass.Message.CSLogin} message CSLogin
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            CSLogin.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.openId = "";
                    object.platform = 0;
                    object.token = "";
                    object.version = "";
                }
                if (message.openId != null && message.hasOwnProperty("openId"))
                    object.openId = message.openId;
                if (message.platform != null && message.hasOwnProperty("platform"))
                    object.platform = message.platform;
                if (message.token != null && message.hasOwnProperty("token"))
                    object.token = message.token;
                if (message.version != null && message.hasOwnProperty("version"))
                    object.version = message.version;
                return object;
            };

            /**
             * Converts this CSLogin to JSON.
             * @function toJSON
             * @memberof GPBClass.Message.CSLogin
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            CSLogin.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for CSLogin
             * @function getTypeUrl
             * @memberof GPBClass.Message.CSLogin
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            CSLogin.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/GPBClass.Message.CSLogin";
            };

            return CSLogin;
        })();

        Message.SCLogin = (function() {

            /**
             * Properties of a SCLogin.
             * @memberof GPBClass.Message
             * @interface ISCLogin
             * @property {number|null} [uid] SCLogin uid
             * @property {string|null} [openId] SCLogin openId
             * @property {string|null} [sessionId] SCLogin sessionId
             * @property {number|Long|null} [regTime] SCLogin regTime
             * @property {number|null} [loginType] SCLogin loginType
             */

            /**
             * Constructs a new SCLogin.
             * @memberof GPBClass.Message
             * @classdesc Represents a SCLogin.
             * @implements ISCLogin
             * @constructor
             * @param {GPBClass.Message.ISCLogin=} [properties] Properties to set
             */
            function SCLogin(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * SCLogin uid.
             * @member {number} uid
             * @memberof GPBClass.Message.SCLogin
             * @instance
             */
            SCLogin.prototype.uid = 0;

            /**
             * SCLogin openId.
             * @member {string} openId
             * @memberof GPBClass.Message.SCLogin
             * @instance
             */
            SCLogin.prototype.openId = "";

            /**
             * SCLogin sessionId.
             * @member {string} sessionId
             * @memberof GPBClass.Message.SCLogin
             * @instance
             */
            SCLogin.prototype.sessionId = "";

            /**
             * SCLogin regTime.
             * @member {number|Long} regTime
             * @memberof GPBClass.Message.SCLogin
             * @instance
             */
            SCLogin.prototype.regTime = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

            /**
             * SCLogin loginType.
             * @member {number} loginType
             * @memberof GPBClass.Message.SCLogin
             * @instance
             */
            SCLogin.prototype.loginType = 0;

            /**
             * Creates a new SCLogin instance using the specified properties.
             * @function create
             * @memberof GPBClass.Message.SCLogin
             * @static
             * @param {GPBClass.Message.ISCLogin=} [properties] Properties to set
             * @returns {GPBClass.Message.SCLogin} SCLogin instance
             */
            SCLogin.create = function create(properties) {
                return new SCLogin(properties);
            };

            /**
             * Encodes the specified SCLogin message. Does not implicitly {@link GPBClass.Message.SCLogin.verify|verify} messages.
             * @function encode
             * @memberof GPBClass.Message.SCLogin
             * @static
             * @param {GPBClass.Message.ISCLogin} message SCLogin message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SCLogin.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.uid != null && Object.hasOwnProperty.call(message, "uid"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.uid);
                if (message.openId != null && Object.hasOwnProperty.call(message, "openId"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.openId);
                if (message.sessionId != null && Object.hasOwnProperty.call(message, "sessionId"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.sessionId);
                if (message.regTime != null && Object.hasOwnProperty.call(message, "regTime"))
                    writer.uint32(/* id 4, wireType 0 =*/32).int64(message.regTime);
                if (message.loginType != null && Object.hasOwnProperty.call(message, "loginType"))
                    writer.uint32(/* id 5, wireType 0 =*/40).int32(message.loginType);
                return writer;
            };

            /**
             * Encodes the specified SCLogin message, length delimited. Does not implicitly {@link GPBClass.Message.SCLogin.verify|verify} messages.
             * @function encodeDelimited
             * @memberof GPBClass.Message.SCLogin
             * @static
             * @param {GPBClass.Message.ISCLogin} message SCLogin message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SCLogin.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a SCLogin message from the specified reader or buffer.
             * @function decode
             * @memberof GPBClass.Message.SCLogin
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {GPBClass.Message.SCLogin} SCLogin
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SCLogin.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GPBClass.Message.SCLogin();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.uid = reader.int32();
                            break;
                        }
                    case 2: {
                            message.openId = reader.string();
                            break;
                        }
                    case 3: {
                            message.sessionId = reader.string();
                            break;
                        }
                    case 4: {
                            message.regTime = reader.int64();
                            break;
                        }
                    case 5: {
                            message.loginType = reader.int32();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a SCLogin message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof GPBClass.Message.SCLogin
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {GPBClass.Message.SCLogin} SCLogin
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SCLogin.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a SCLogin message.
             * @function verify
             * @memberof GPBClass.Message.SCLogin
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SCLogin.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.uid != null && message.hasOwnProperty("uid"))
                    if (!$util.isInteger(message.uid))
                        return "uid: integer expected";
                if (message.openId != null && message.hasOwnProperty("openId"))
                    if (!$util.isString(message.openId))
                        return "openId: string expected";
                if (message.sessionId != null && message.hasOwnProperty("sessionId"))
                    if (!$util.isString(message.sessionId))
                        return "sessionId: string expected";
                if (message.regTime != null && message.hasOwnProperty("regTime"))
                    if (!$util.isInteger(message.regTime) && !(message.regTime && $util.isInteger(message.regTime.low) && $util.isInteger(message.regTime.high)))
                        return "regTime: integer|Long expected";
                if (message.loginType != null && message.hasOwnProperty("loginType"))
                    if (!$util.isInteger(message.loginType))
                        return "loginType: integer expected";
                return null;
            };

            /**
             * Creates a SCLogin message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof GPBClass.Message.SCLogin
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {GPBClass.Message.SCLogin} SCLogin
             */
            SCLogin.fromObject = function fromObject(object) {
                if (object instanceof $root.GPBClass.Message.SCLogin)
                    return object;
                var message = new $root.GPBClass.Message.SCLogin();
                if (object.uid != null)
                    message.uid = object.uid | 0;
                if (object.openId != null)
                    message.openId = String(object.openId);
                if (object.sessionId != null)
                    message.sessionId = String(object.sessionId);
                if (object.regTime != null)
                    if ($util.Long)
                        (message.regTime = $util.Long.fromValue(object.regTime)).unsigned = false;
                    else if (typeof object.regTime === "string")
                        message.regTime = parseInt(object.regTime, 10);
                    else if (typeof object.regTime === "number")
                        message.regTime = object.regTime;
                    else if (typeof object.regTime === "object")
                        message.regTime = new $util.LongBits(object.regTime.low >>> 0, object.regTime.high >>> 0).toNumber();
                if (object.loginType != null)
                    message.loginType = object.loginType | 0;
                return message;
            };

            /**
             * Creates a plain object from a SCLogin message. Also converts values to other types if specified.
             * @function toObject
             * @memberof GPBClass.Message.SCLogin
             * @static
             * @param {GPBClass.Message.SCLogin} message SCLogin
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SCLogin.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.uid = 0;
                    object.openId = "";
                    object.sessionId = "";
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, false);
                        object.regTime = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.regTime = options.longs === String ? "0" : 0;
                    object.loginType = 0;
                }
                if (message.uid != null && message.hasOwnProperty("uid"))
                    object.uid = message.uid;
                if (message.openId != null && message.hasOwnProperty("openId"))
                    object.openId = message.openId;
                if (message.sessionId != null && message.hasOwnProperty("sessionId"))
                    object.sessionId = message.sessionId;
                if (message.regTime != null && message.hasOwnProperty("regTime"))
                    if (typeof message.regTime === "number")
                        object.regTime = options.longs === String ? String(message.regTime) : message.regTime;
                    else
                        object.regTime = options.longs === String ? $util.Long.prototype.toString.call(message.regTime) : options.longs === Number ? new $util.LongBits(message.regTime.low >>> 0, message.regTime.high >>> 0).toNumber() : message.regTime;
                if (message.loginType != null && message.hasOwnProperty("loginType"))
                    object.loginType = message.loginType;
                return object;
            };

            /**
             * Converts this SCLogin to JSON.
             * @function toJSON
             * @memberof GPBClass.Message.SCLogin
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SCLogin.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for SCLogin
             * @function getTypeUrl
             * @memberof GPBClass.Message.SCLogin
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            SCLogin.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/GPBClass.Message.SCLogin";
            };

            return SCLogin;
        })();

        Message.CSSaveData = (function() {

            /**
             * Properties of a CSSaveData.
             * @memberof GPBClass.Message
             * @interface ICSSaveData
             * @property {Array.<GPBClass.Message.IUserData>|null} [userData] CSSaveData userData
             */

            /**
             * Constructs a new CSSaveData.
             * @memberof GPBClass.Message
             * @classdesc Represents a CSSaveData.
             * @implements ICSSaveData
             * @constructor
             * @param {GPBClass.Message.ICSSaveData=} [properties] Properties to set
             */
            function CSSaveData(properties) {
                this.userData = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * CSSaveData userData.
             * @member {Array.<GPBClass.Message.IUserData>} userData
             * @memberof GPBClass.Message.CSSaveData
             * @instance
             */
            CSSaveData.prototype.userData = $util.emptyArray;

            /**
             * Creates a new CSSaveData instance using the specified properties.
             * @function create
             * @memberof GPBClass.Message.CSSaveData
             * @static
             * @param {GPBClass.Message.ICSSaveData=} [properties] Properties to set
             * @returns {GPBClass.Message.CSSaveData} CSSaveData instance
             */
            CSSaveData.create = function create(properties) {
                return new CSSaveData(properties);
            };

            /**
             * Encodes the specified CSSaveData message. Does not implicitly {@link GPBClass.Message.CSSaveData.verify|verify} messages.
             * @function encode
             * @memberof GPBClass.Message.CSSaveData
             * @static
             * @param {GPBClass.Message.ICSSaveData} message CSSaveData message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CSSaveData.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.userData != null && message.userData.length)
                    for (var i = 0; i < message.userData.length; ++i)
                        $root.GPBClass.Message.UserData.encode(message.userData[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified CSSaveData message, length delimited. Does not implicitly {@link GPBClass.Message.CSSaveData.verify|verify} messages.
             * @function encodeDelimited
             * @memberof GPBClass.Message.CSSaveData
             * @static
             * @param {GPBClass.Message.ICSSaveData} message CSSaveData message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CSSaveData.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a CSSaveData message from the specified reader or buffer.
             * @function decode
             * @memberof GPBClass.Message.CSSaveData
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {GPBClass.Message.CSSaveData} CSSaveData
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CSSaveData.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GPBClass.Message.CSSaveData();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            if (!(message.userData && message.userData.length))
                                message.userData = [];
                            message.userData.push($root.GPBClass.Message.UserData.decode(reader, reader.uint32()));
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a CSSaveData message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof GPBClass.Message.CSSaveData
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {GPBClass.Message.CSSaveData} CSSaveData
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CSSaveData.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a CSSaveData message.
             * @function verify
             * @memberof GPBClass.Message.CSSaveData
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            CSSaveData.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.userData != null && message.hasOwnProperty("userData")) {
                    if (!Array.isArray(message.userData))
                        return "userData: array expected";
                    for (var i = 0; i < message.userData.length; ++i) {
                        var error = $root.GPBClass.Message.UserData.verify(message.userData[i]);
                        if (error)
                            return "userData." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a CSSaveData message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof GPBClass.Message.CSSaveData
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {GPBClass.Message.CSSaveData} CSSaveData
             */
            CSSaveData.fromObject = function fromObject(object) {
                if (object instanceof $root.GPBClass.Message.CSSaveData)
                    return object;
                var message = new $root.GPBClass.Message.CSSaveData();
                if (object.userData) {
                    if (!Array.isArray(object.userData))
                        throw TypeError(".GPBClass.Message.CSSaveData.userData: array expected");
                    message.userData = [];
                    for (var i = 0; i < object.userData.length; ++i) {
                        if (typeof object.userData[i] !== "object")
                            throw TypeError(".GPBClass.Message.CSSaveData.userData: object expected");
                        message.userData[i] = $root.GPBClass.Message.UserData.fromObject(object.userData[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a CSSaveData message. Also converts values to other types if specified.
             * @function toObject
             * @memberof GPBClass.Message.CSSaveData
             * @static
             * @param {GPBClass.Message.CSSaveData} message CSSaveData
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            CSSaveData.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.userData = [];
                if (message.userData && message.userData.length) {
                    object.userData = [];
                    for (var j = 0; j < message.userData.length; ++j)
                        object.userData[j] = $root.GPBClass.Message.UserData.toObject(message.userData[j], options);
                }
                return object;
            };

            /**
             * Converts this CSSaveData to JSON.
             * @function toJSON
             * @memberof GPBClass.Message.CSSaveData
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            CSSaveData.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for CSSaveData
             * @function getTypeUrl
             * @memberof GPBClass.Message.CSSaveData
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            CSSaveData.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/GPBClass.Message.CSSaveData";
            };

            return CSSaveData;
        })();

        Message.SCSaveData = (function() {

            /**
             * Properties of a SCSaveData.
             * @memberof GPBClass.Message
             * @interface ISCSaveData
             */

            /**
             * Constructs a new SCSaveData.
             * @memberof GPBClass.Message
             * @classdesc Represents a SCSaveData.
             * @implements ISCSaveData
             * @constructor
             * @param {GPBClass.Message.ISCSaveData=} [properties] Properties to set
             */
            function SCSaveData(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Creates a new SCSaveData instance using the specified properties.
             * @function create
             * @memberof GPBClass.Message.SCSaveData
             * @static
             * @param {GPBClass.Message.ISCSaveData=} [properties] Properties to set
             * @returns {GPBClass.Message.SCSaveData} SCSaveData instance
             */
            SCSaveData.create = function create(properties) {
                return new SCSaveData(properties);
            };

            /**
             * Encodes the specified SCSaveData message. Does not implicitly {@link GPBClass.Message.SCSaveData.verify|verify} messages.
             * @function encode
             * @memberof GPBClass.Message.SCSaveData
             * @static
             * @param {GPBClass.Message.ISCSaveData} message SCSaveData message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SCSaveData.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };

            /**
             * Encodes the specified SCSaveData message, length delimited. Does not implicitly {@link GPBClass.Message.SCSaveData.verify|verify} messages.
             * @function encodeDelimited
             * @memberof GPBClass.Message.SCSaveData
             * @static
             * @param {GPBClass.Message.ISCSaveData} message SCSaveData message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SCSaveData.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a SCSaveData message from the specified reader or buffer.
             * @function decode
             * @memberof GPBClass.Message.SCSaveData
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {GPBClass.Message.SCSaveData} SCSaveData
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SCSaveData.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GPBClass.Message.SCSaveData();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a SCSaveData message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof GPBClass.Message.SCSaveData
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {GPBClass.Message.SCSaveData} SCSaveData
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SCSaveData.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a SCSaveData message.
             * @function verify
             * @memberof GPBClass.Message.SCSaveData
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SCSaveData.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                return null;
            };

            /**
             * Creates a SCSaveData message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof GPBClass.Message.SCSaveData
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {GPBClass.Message.SCSaveData} SCSaveData
             */
            SCSaveData.fromObject = function fromObject(object) {
                if (object instanceof $root.GPBClass.Message.SCSaveData)
                    return object;
                return new $root.GPBClass.Message.SCSaveData();
            };

            /**
             * Creates a plain object from a SCSaveData message. Also converts values to other types if specified.
             * @function toObject
             * @memberof GPBClass.Message.SCSaveData
             * @static
             * @param {GPBClass.Message.SCSaveData} message SCSaveData
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SCSaveData.toObject = function toObject() {
                return {};
            };

            /**
             * Converts this SCSaveData to JSON.
             * @function toJSON
             * @memberof GPBClass.Message.SCSaveData
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SCSaveData.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for SCSaveData
             * @function getTypeUrl
             * @memberof GPBClass.Message.SCSaveData
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            SCSaveData.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/GPBClass.Message.SCSaveData";
            };

            return SCSaveData;
        })();

        Message.CSSyncData = (function() {

            /**
             * Properties of a CSSyncData.
             * @memberof GPBClass.Message
             * @interface ICSSyncData
             */

            /**
             * Constructs a new CSSyncData.
             * @memberof GPBClass.Message
             * @classdesc Represents a CSSyncData.
             * @implements ICSSyncData
             * @constructor
             * @param {GPBClass.Message.ICSSyncData=} [properties] Properties to set
             */
            function CSSyncData(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Creates a new CSSyncData instance using the specified properties.
             * @function create
             * @memberof GPBClass.Message.CSSyncData
             * @static
             * @param {GPBClass.Message.ICSSyncData=} [properties] Properties to set
             * @returns {GPBClass.Message.CSSyncData} CSSyncData instance
             */
            CSSyncData.create = function create(properties) {
                return new CSSyncData(properties);
            };

            /**
             * Encodes the specified CSSyncData message. Does not implicitly {@link GPBClass.Message.CSSyncData.verify|verify} messages.
             * @function encode
             * @memberof GPBClass.Message.CSSyncData
             * @static
             * @param {GPBClass.Message.ICSSyncData} message CSSyncData message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CSSyncData.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };

            /**
             * Encodes the specified CSSyncData message, length delimited. Does not implicitly {@link GPBClass.Message.CSSyncData.verify|verify} messages.
             * @function encodeDelimited
             * @memberof GPBClass.Message.CSSyncData
             * @static
             * @param {GPBClass.Message.ICSSyncData} message CSSyncData message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CSSyncData.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a CSSyncData message from the specified reader or buffer.
             * @function decode
             * @memberof GPBClass.Message.CSSyncData
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {GPBClass.Message.CSSyncData} CSSyncData
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CSSyncData.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GPBClass.Message.CSSyncData();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a CSSyncData message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof GPBClass.Message.CSSyncData
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {GPBClass.Message.CSSyncData} CSSyncData
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CSSyncData.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a CSSyncData message.
             * @function verify
             * @memberof GPBClass.Message.CSSyncData
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            CSSyncData.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                return null;
            };

            /**
             * Creates a CSSyncData message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof GPBClass.Message.CSSyncData
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {GPBClass.Message.CSSyncData} CSSyncData
             */
            CSSyncData.fromObject = function fromObject(object) {
                if (object instanceof $root.GPBClass.Message.CSSyncData)
                    return object;
                return new $root.GPBClass.Message.CSSyncData();
            };

            /**
             * Creates a plain object from a CSSyncData message. Also converts values to other types if specified.
             * @function toObject
             * @memberof GPBClass.Message.CSSyncData
             * @static
             * @param {GPBClass.Message.CSSyncData} message CSSyncData
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            CSSyncData.toObject = function toObject() {
                return {};
            };

            /**
             * Converts this CSSyncData to JSON.
             * @function toJSON
             * @memberof GPBClass.Message.CSSyncData
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            CSSyncData.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for CSSyncData
             * @function getTypeUrl
             * @memberof GPBClass.Message.CSSyncData
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            CSSyncData.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/GPBClass.Message.CSSyncData";
            };

            return CSSyncData;
        })();

        Message.SCSyncData = (function() {

            /**
             * Properties of a SCSyncData.
             * @memberof GPBClass.Message
             * @interface ISCSyncData
             * @property {Array.<GPBClass.Message.IUserData>|null} [userData] SCSyncData userData
             */

            /**
             * Constructs a new SCSyncData.
             * @memberof GPBClass.Message
             * @classdesc Represents a SCSyncData.
             * @implements ISCSyncData
             * @constructor
             * @param {GPBClass.Message.ISCSyncData=} [properties] Properties to set
             */
            function SCSyncData(properties) {
                this.userData = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * SCSyncData userData.
             * @member {Array.<GPBClass.Message.IUserData>} userData
             * @memberof GPBClass.Message.SCSyncData
             * @instance
             */
            SCSyncData.prototype.userData = $util.emptyArray;

            /**
             * Creates a new SCSyncData instance using the specified properties.
             * @function create
             * @memberof GPBClass.Message.SCSyncData
             * @static
             * @param {GPBClass.Message.ISCSyncData=} [properties] Properties to set
             * @returns {GPBClass.Message.SCSyncData} SCSyncData instance
             */
            SCSyncData.create = function create(properties) {
                return new SCSyncData(properties);
            };

            /**
             * Encodes the specified SCSyncData message. Does not implicitly {@link GPBClass.Message.SCSyncData.verify|verify} messages.
             * @function encode
             * @memberof GPBClass.Message.SCSyncData
             * @static
             * @param {GPBClass.Message.ISCSyncData} message SCSyncData message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SCSyncData.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.userData != null && message.userData.length)
                    for (var i = 0; i < message.userData.length; ++i)
                        $root.GPBClass.Message.UserData.encode(message.userData[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified SCSyncData message, length delimited. Does not implicitly {@link GPBClass.Message.SCSyncData.verify|verify} messages.
             * @function encodeDelimited
             * @memberof GPBClass.Message.SCSyncData
             * @static
             * @param {GPBClass.Message.ISCSyncData} message SCSyncData message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SCSyncData.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a SCSyncData message from the specified reader or buffer.
             * @function decode
             * @memberof GPBClass.Message.SCSyncData
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {GPBClass.Message.SCSyncData} SCSyncData
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SCSyncData.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GPBClass.Message.SCSyncData();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            if (!(message.userData && message.userData.length))
                                message.userData = [];
                            message.userData.push($root.GPBClass.Message.UserData.decode(reader, reader.uint32()));
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a SCSyncData message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof GPBClass.Message.SCSyncData
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {GPBClass.Message.SCSyncData} SCSyncData
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SCSyncData.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a SCSyncData message.
             * @function verify
             * @memberof GPBClass.Message.SCSyncData
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SCSyncData.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.userData != null && message.hasOwnProperty("userData")) {
                    if (!Array.isArray(message.userData))
                        return "userData: array expected";
                    for (var i = 0; i < message.userData.length; ++i) {
                        var error = $root.GPBClass.Message.UserData.verify(message.userData[i]);
                        if (error)
                            return "userData." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a SCSyncData message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof GPBClass.Message.SCSyncData
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {GPBClass.Message.SCSyncData} SCSyncData
             */
            SCSyncData.fromObject = function fromObject(object) {
                if (object instanceof $root.GPBClass.Message.SCSyncData)
                    return object;
                var message = new $root.GPBClass.Message.SCSyncData();
                if (object.userData) {
                    if (!Array.isArray(object.userData))
                        throw TypeError(".GPBClass.Message.SCSyncData.userData: array expected");
                    message.userData = [];
                    for (var i = 0; i < object.userData.length; ++i) {
                        if (typeof object.userData[i] !== "object")
                            throw TypeError(".GPBClass.Message.SCSyncData.userData: object expected");
                        message.userData[i] = $root.GPBClass.Message.UserData.fromObject(object.userData[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a SCSyncData message. Also converts values to other types if specified.
             * @function toObject
             * @memberof GPBClass.Message.SCSyncData
             * @static
             * @param {GPBClass.Message.SCSyncData} message SCSyncData
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SCSyncData.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.userData = [];
                if (message.userData && message.userData.length) {
                    object.userData = [];
                    for (var j = 0; j < message.userData.length; ++j)
                        object.userData[j] = $root.GPBClass.Message.UserData.toObject(message.userData[j], options);
                }
                return object;
            };

            /**
             * Converts this SCSyncData to JSON.
             * @function toJSON
             * @memberof GPBClass.Message.SCSyncData
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SCSyncData.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for SCSyncData
             * @function getTypeUrl
             * @memberof GPBClass.Message.SCSyncData
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            SCSyncData.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/GPBClass.Message.SCSyncData";
            };

            return SCSyncData;
        })();

        Message.CSEventReport = (function() {

            /**
             * Properties of a CSEventReport.
             * @memberof GPBClass.Message
             * @interface ICSEventReport
             * @property {string|null} [event] CSEventReport event
             * @property {string|null} [data] CSEventReport data
             * @property {string|null} [afid] CSEventReport afid
             * @property {string|null} [version] CSEventReport version
             */

            /**
             * Constructs a new CSEventReport.
             * @memberof GPBClass.Message
             * @classdesc Represents a CSEventReport.
             * @implements ICSEventReport
             * @constructor
             * @param {GPBClass.Message.ICSEventReport=} [properties] Properties to set
             */
            function CSEventReport(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * CSEventReport event.
             * @member {string} event
             * @memberof GPBClass.Message.CSEventReport
             * @instance
             */
            CSEventReport.prototype.event = "";

            /**
             * CSEventReport data.
             * @member {string} data
             * @memberof GPBClass.Message.CSEventReport
             * @instance
             */
            CSEventReport.prototype.data = "";

            /**
             * CSEventReport afid.
             * @member {string} afid
             * @memberof GPBClass.Message.CSEventReport
             * @instance
             */
            CSEventReport.prototype.afid = "";

            /**
             * CSEventReport version.
             * @member {string} version
             * @memberof GPBClass.Message.CSEventReport
             * @instance
             */
            CSEventReport.prototype.version = "";

            /**
             * Creates a new CSEventReport instance using the specified properties.
             * @function create
             * @memberof GPBClass.Message.CSEventReport
             * @static
             * @param {GPBClass.Message.ICSEventReport=} [properties] Properties to set
             * @returns {GPBClass.Message.CSEventReport} CSEventReport instance
             */
            CSEventReport.create = function create(properties) {
                return new CSEventReport(properties);
            };

            /**
             * Encodes the specified CSEventReport message. Does not implicitly {@link GPBClass.Message.CSEventReport.verify|verify} messages.
             * @function encode
             * @memberof GPBClass.Message.CSEventReport
             * @static
             * @param {GPBClass.Message.ICSEventReport} message CSEventReport message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CSEventReport.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.event != null && Object.hasOwnProperty.call(message, "event"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.event);
                if (message.data != null && Object.hasOwnProperty.call(message, "data"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.data);
                if (message.afid != null && Object.hasOwnProperty.call(message, "afid"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.afid);
                if (message.version != null && Object.hasOwnProperty.call(message, "version"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.version);
                return writer;
            };

            /**
             * Encodes the specified CSEventReport message, length delimited. Does not implicitly {@link GPBClass.Message.CSEventReport.verify|verify} messages.
             * @function encodeDelimited
             * @memberof GPBClass.Message.CSEventReport
             * @static
             * @param {GPBClass.Message.ICSEventReport} message CSEventReport message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CSEventReport.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a CSEventReport message from the specified reader or buffer.
             * @function decode
             * @memberof GPBClass.Message.CSEventReport
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {GPBClass.Message.CSEventReport} CSEventReport
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CSEventReport.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GPBClass.Message.CSEventReport();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.event = reader.string();
                            break;
                        }
                    case 2: {
                            message.data = reader.string();
                            break;
                        }
                    case 3: {
                            message.afid = reader.string();
                            break;
                        }
                    case 4: {
                            message.version = reader.string();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a CSEventReport message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof GPBClass.Message.CSEventReport
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {GPBClass.Message.CSEventReport} CSEventReport
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CSEventReport.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a CSEventReport message.
             * @function verify
             * @memberof GPBClass.Message.CSEventReport
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            CSEventReport.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.event != null && message.hasOwnProperty("event"))
                    if (!$util.isString(message.event))
                        return "event: string expected";
                if (message.data != null && message.hasOwnProperty("data"))
                    if (!$util.isString(message.data))
                        return "data: string expected";
                if (message.afid != null && message.hasOwnProperty("afid"))
                    if (!$util.isString(message.afid))
                        return "afid: string expected";
                if (message.version != null && message.hasOwnProperty("version"))
                    if (!$util.isString(message.version))
                        return "version: string expected";
                return null;
            };

            /**
             * Creates a CSEventReport message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof GPBClass.Message.CSEventReport
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {GPBClass.Message.CSEventReport} CSEventReport
             */
            CSEventReport.fromObject = function fromObject(object) {
                if (object instanceof $root.GPBClass.Message.CSEventReport)
                    return object;
                var message = new $root.GPBClass.Message.CSEventReport();
                if (object.event != null)
                    message.event = String(object.event);
                if (object.data != null)
                    message.data = String(object.data);
                if (object.afid != null)
                    message.afid = String(object.afid);
                if (object.version != null)
                    message.version = String(object.version);
                return message;
            };

            /**
             * Creates a plain object from a CSEventReport message. Also converts values to other types if specified.
             * @function toObject
             * @memberof GPBClass.Message.CSEventReport
             * @static
             * @param {GPBClass.Message.CSEventReport} message CSEventReport
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            CSEventReport.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.event = "";
                    object.data = "";
                    object.afid = "";
                    object.version = "";
                }
                if (message.event != null && message.hasOwnProperty("event"))
                    object.event = message.event;
                if (message.data != null && message.hasOwnProperty("data"))
                    object.data = message.data;
                if (message.afid != null && message.hasOwnProperty("afid"))
                    object.afid = message.afid;
                if (message.version != null && message.hasOwnProperty("version"))
                    object.version = message.version;
                return object;
            };

            /**
             * Converts this CSEventReport to JSON.
             * @function toJSON
             * @memberof GPBClass.Message.CSEventReport
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            CSEventReport.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for CSEventReport
             * @function getTypeUrl
             * @memberof GPBClass.Message.CSEventReport
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            CSEventReport.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/GPBClass.Message.CSEventReport";
            };

            return CSEventReport;
        })();

        Message.SCEventReport = (function() {

            /**
             * Properties of a SCEventReport.
             * @memberof GPBClass.Message
             * @interface ISCEventReport
             */

            /**
             * Constructs a new SCEventReport.
             * @memberof GPBClass.Message
             * @classdesc Represents a SCEventReport.
             * @implements ISCEventReport
             * @constructor
             * @param {GPBClass.Message.ISCEventReport=} [properties] Properties to set
             */
            function SCEventReport(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Creates a new SCEventReport instance using the specified properties.
             * @function create
             * @memberof GPBClass.Message.SCEventReport
             * @static
             * @param {GPBClass.Message.ISCEventReport=} [properties] Properties to set
             * @returns {GPBClass.Message.SCEventReport} SCEventReport instance
             */
            SCEventReport.create = function create(properties) {
                return new SCEventReport(properties);
            };

            /**
             * Encodes the specified SCEventReport message. Does not implicitly {@link GPBClass.Message.SCEventReport.verify|verify} messages.
             * @function encode
             * @memberof GPBClass.Message.SCEventReport
             * @static
             * @param {GPBClass.Message.ISCEventReport} message SCEventReport message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SCEventReport.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };

            /**
             * Encodes the specified SCEventReport message, length delimited. Does not implicitly {@link GPBClass.Message.SCEventReport.verify|verify} messages.
             * @function encodeDelimited
             * @memberof GPBClass.Message.SCEventReport
             * @static
             * @param {GPBClass.Message.ISCEventReport} message SCEventReport message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SCEventReport.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a SCEventReport message from the specified reader or buffer.
             * @function decode
             * @memberof GPBClass.Message.SCEventReport
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {GPBClass.Message.SCEventReport} SCEventReport
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SCEventReport.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GPBClass.Message.SCEventReport();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a SCEventReport message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof GPBClass.Message.SCEventReport
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {GPBClass.Message.SCEventReport} SCEventReport
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SCEventReport.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a SCEventReport message.
             * @function verify
             * @memberof GPBClass.Message.SCEventReport
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SCEventReport.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                return null;
            };

            /**
             * Creates a SCEventReport message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof GPBClass.Message.SCEventReport
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {GPBClass.Message.SCEventReport} SCEventReport
             */
            SCEventReport.fromObject = function fromObject(object) {
                if (object instanceof $root.GPBClass.Message.SCEventReport)
                    return object;
                return new $root.GPBClass.Message.SCEventReport();
            };

            /**
             * Creates a plain object from a SCEventReport message. Also converts values to other types if specified.
             * @function toObject
             * @memberof GPBClass.Message.SCEventReport
             * @static
             * @param {GPBClass.Message.SCEventReport} message SCEventReport
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SCEventReport.toObject = function toObject() {
                return {};
            };

            /**
             * Converts this SCEventReport to JSON.
             * @function toJSON
             * @memberof GPBClass.Message.SCEventReport
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SCEventReport.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for SCEventReport
             * @function getTypeUrl
             * @memberof GPBClass.Message.SCEventReport
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            SCEventReport.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/GPBClass.Message.SCEventReport";
            };

            return SCEventReport;
        })();

        Message.UserData = (function() {

            /**
             * Properties of a UserData.
             * @memberof GPBClass.Message
             * @interface IUserData
             * @property {string|null} [dataType] UserData dataType
             * @property {string|null} [seriType] UserData seriType
             * @property {string|null} [content] UserData content
             */

            /**
             * Constructs a new UserData.
             * @memberof GPBClass.Message
             * @classdesc Represents a UserData.
             * @implements IUserData
             * @constructor
             * @param {GPBClass.Message.IUserData=} [properties] Properties to set
             */
            function UserData(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * UserData dataType.
             * @member {string} dataType
             * @memberof GPBClass.Message.UserData
             * @instance
             */
            UserData.prototype.dataType = "";

            /**
             * UserData seriType.
             * @member {string} seriType
             * @memberof GPBClass.Message.UserData
             * @instance
             */
            UserData.prototype.seriType = "";

            /**
             * UserData content.
             * @member {string} content
             * @memberof GPBClass.Message.UserData
             * @instance
             */
            UserData.prototype.content = "";

            /**
             * Creates a new UserData instance using the specified properties.
             * @function create
             * @memberof GPBClass.Message.UserData
             * @static
             * @param {GPBClass.Message.IUserData=} [properties] Properties to set
             * @returns {GPBClass.Message.UserData} UserData instance
             */
            UserData.create = function create(properties) {
                return new UserData(properties);
            };

            /**
             * Encodes the specified UserData message. Does not implicitly {@link GPBClass.Message.UserData.verify|verify} messages.
             * @function encode
             * @memberof GPBClass.Message.UserData
             * @static
             * @param {GPBClass.Message.IUserData} message UserData message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UserData.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.dataType != null && Object.hasOwnProperty.call(message, "dataType"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.dataType);
                if (message.seriType != null && Object.hasOwnProperty.call(message, "seriType"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.seriType);
                if (message.content != null && Object.hasOwnProperty.call(message, "content"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.content);
                return writer;
            };

            /**
             * Encodes the specified UserData message, length delimited. Does not implicitly {@link GPBClass.Message.UserData.verify|verify} messages.
             * @function encodeDelimited
             * @memberof GPBClass.Message.UserData
             * @static
             * @param {GPBClass.Message.IUserData} message UserData message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UserData.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a UserData message from the specified reader or buffer.
             * @function decode
             * @memberof GPBClass.Message.UserData
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {GPBClass.Message.UserData} UserData
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UserData.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GPBClass.Message.UserData();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.dataType = reader.string();
                            break;
                        }
                    case 2: {
                            message.seriType = reader.string();
                            break;
                        }
                    case 3: {
                            message.content = reader.string();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a UserData message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof GPBClass.Message.UserData
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {GPBClass.Message.UserData} UserData
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UserData.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a UserData message.
             * @function verify
             * @memberof GPBClass.Message.UserData
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            UserData.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.dataType != null && message.hasOwnProperty("dataType"))
                    if (!$util.isString(message.dataType))
                        return "dataType: string expected";
                if (message.seriType != null && message.hasOwnProperty("seriType"))
                    if (!$util.isString(message.seriType))
                        return "seriType: string expected";
                if (message.content != null && message.hasOwnProperty("content"))
                    if (!$util.isString(message.content))
                        return "content: string expected";
                return null;
            };

            /**
             * Creates a UserData message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof GPBClass.Message.UserData
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {GPBClass.Message.UserData} UserData
             */
            UserData.fromObject = function fromObject(object) {
                if (object instanceof $root.GPBClass.Message.UserData)
                    return object;
                var message = new $root.GPBClass.Message.UserData();
                if (object.dataType != null)
                    message.dataType = String(object.dataType);
                if (object.seriType != null)
                    message.seriType = String(object.seriType);
                if (object.content != null)
                    message.content = String(object.content);
                return message;
            };

            /**
             * Creates a plain object from a UserData message. Also converts values to other types if specified.
             * @function toObject
             * @memberof GPBClass.Message.UserData
             * @static
             * @param {GPBClass.Message.UserData} message UserData
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            UserData.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.dataType = "";
                    object.seriType = "";
                    object.content = "";
                }
                if (message.dataType != null && message.hasOwnProperty("dataType"))
                    object.dataType = message.dataType;
                if (message.seriType != null && message.hasOwnProperty("seriType"))
                    object.seriType = message.seriType;
                if (message.content != null && message.hasOwnProperty("content"))
                    object.content = message.content;
                return object;
            };

            /**
             * Converts this UserData to JSON.
             * @function toJSON
             * @memberof GPBClass.Message.UserData
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            UserData.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for UserData
             * @function getTypeUrl
             * @memberof GPBClass.Message.UserData
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            UserData.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/GPBClass.Message.UserData";
            };

            return UserData;
        })();

        return Message;
    })();

    return GPBClass;
})();

module.exports = $root;
