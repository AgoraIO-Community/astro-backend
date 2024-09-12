/**
 * Generated by the protoc-gen-ts.  DO NOT EDIT!
 * compiler version: 3.21.12
 * source: src/proto/definition.proto
 * git: https://github.com/thesayyn/protoc-gen-ts */
import * as pb_1 from "google-protobuf";
export namespace astrobackend {
    export class Text extends pb_1.Message {
        #one_of_decls: number[][] = [];
        constructor(data?: any[] | {
            vendor?: number;
            version?: number;
            seqnum?: number;
            uid?: number;
            flag?: number;
            time?: number;
            lang?: number;
            starttime?: number;
            offtime?: number;
            words?: Word[];
        }) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [10], this.#one_of_decls);
            if (!Array.isArray(data) && typeof data == "object") {
                if ("vendor" in data && data.vendor != undefined) {
                    this.vendor = data.vendor;
                }
                if ("version" in data && data.version != undefined) {
                    this.version = data.version;
                }
                if ("seqnum" in data && data.seqnum != undefined) {
                    this.seqnum = data.seqnum;
                }
                if ("uid" in data && data.uid != undefined) {
                    this.uid = data.uid;
                }
                if ("flag" in data && data.flag != undefined) {
                    this.flag = data.flag;
                }
                if ("time" in data && data.time != undefined) {
                    this.time = data.time;
                }
                if ("lang" in data && data.lang != undefined) {
                    this.lang = data.lang;
                }
                if ("starttime" in data && data.starttime != undefined) {
                    this.starttime = data.starttime;
                }
                if ("offtime" in data && data.offtime != undefined) {
                    this.offtime = data.offtime;
                }
                if ("words" in data && data.words != undefined) {
                    this.words = data.words;
                }
            }
        }
        get vendor() {
            return pb_1.Message.getFieldWithDefault(this, 1, 0) as number;
        }
        set vendor(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get version() {
            return pb_1.Message.getFieldWithDefault(this, 2, 0) as number;
        }
        set version(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        get seqnum() {
            return pb_1.Message.getFieldWithDefault(this, 3, 0) as number;
        }
        set seqnum(value: number) {
            pb_1.Message.setField(this, 3, value);
        }
        get uid() {
            return pb_1.Message.getFieldWithDefault(this, 4, 0) as number;
        }
        set uid(value: number) {
            pb_1.Message.setField(this, 4, value);
        }
        get flag() {
            return pb_1.Message.getFieldWithDefault(this, 5, 0) as number;
        }
        set flag(value: number) {
            pb_1.Message.setField(this, 5, value);
        }
        get time() {
            return pb_1.Message.getFieldWithDefault(this, 6, 0) as number;
        }
        set time(value: number) {
            pb_1.Message.setField(this, 6, value);
        }
        get lang() {
            return pb_1.Message.getFieldWithDefault(this, 7, 0) as number;
        }
        set lang(value: number) {
            pb_1.Message.setField(this, 7, value);
        }
        get starttime() {
            return pb_1.Message.getFieldWithDefault(this, 8, 0) as number;
        }
        set starttime(value: number) {
            pb_1.Message.setField(this, 8, value);
        }
        get offtime() {
            return pb_1.Message.getFieldWithDefault(this, 9, 0) as number;
        }
        set offtime(value: number) {
            pb_1.Message.setField(this, 9, value);
        }
        get words() {
            return pb_1.Message.getRepeatedWrapperField(this, Word, 10) as Word[];
        }
        set words(value: Word[]) {
            pb_1.Message.setRepeatedWrapperField(this, 10, value);
        }
        static fromObject(data: {
            vendor?: number;
            version?: number;
            seqnum?: number;
            uid?: number;
            flag?: number;
            time?: number;
            lang?: number;
            starttime?: number;
            offtime?: number;
            words?: ReturnType<typeof Word.prototype.toObject>[];
        }): Text {
            const message = new Text({});
            if (data.vendor != null) {
                message.vendor = data.vendor;
            }
            if (data.version != null) {
                message.version = data.version;
            }
            if (data.seqnum != null) {
                message.seqnum = data.seqnum;
            }
            if (data.uid != null) {
                message.uid = data.uid;
            }
            if (data.flag != null) {
                message.flag = data.flag;
            }
            if (data.time != null) {
                message.time = data.time;
            }
            if (data.lang != null) {
                message.lang = data.lang;
            }
            if (data.starttime != null) {
                message.starttime = data.starttime;
            }
            if (data.offtime != null) {
                message.offtime = data.offtime;
            }
            if (data.words != null) {
                message.words = data.words.map(item => Word.fromObject(item));
            }
            return message;
        }
        toObject() {
            const data: {
                vendor?: number;
                version?: number;
                seqnum?: number;
                uid?: number;
                flag?: number;
                time?: number;
                lang?: number;
                starttime?: number;
                offtime?: number;
                words?: ReturnType<typeof Word.prototype.toObject>[];
            } = {};
            if (this.vendor != null) {
                data.vendor = this.vendor;
            }
            if (this.version != null) {
                data.version = this.version;
            }
            if (this.seqnum != null) {
                data.seqnum = this.seqnum;
            }
            if (this.uid != null) {
                data.uid = this.uid;
            }
            if (this.flag != null) {
                data.flag = this.flag;
            }
            if (this.time != null) {
                data.time = this.time;
            }
            if (this.lang != null) {
                data.lang = this.lang;
            }
            if (this.starttime != null) {
                data.starttime = this.starttime;
            }
            if (this.offtime != null) {
                data.offtime = this.offtime;
            }
            if (this.words != null) {
                data.words = this.words.map((item: Word) => item.toObject());
            }
            return data;
        }
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
            const writer = w || new pb_1.BinaryWriter();
            if (this.vendor != 0)
                writer.writeInt32(1, this.vendor);
            if (this.version != 0)
                writer.writeInt32(2, this.version);
            if (this.seqnum != 0)
                writer.writeInt32(3, this.seqnum);
            if (this.uid != 0)
                writer.writeInt32(4, this.uid);
            if (this.flag != 0)
                writer.writeInt32(5, this.flag);
            if (this.time != 0)
                writer.writeInt64(6, this.time);
            if (this.lang != 0)
                writer.writeInt32(7, this.lang);
            if (this.starttime != 0)
                writer.writeInt32(8, this.starttime);
            if (this.offtime != 0)
                writer.writeInt32(9, this.offtime);
            if (this.words.length)
                writer.writeRepeatedMessage(10, this.words, (item: Word) => item.serialize(writer));
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Text {
            const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new Text();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.vendor = reader.readInt32();
                        break;
                    case 2:
                        message.version = reader.readInt32();
                        break;
                    case 3:
                        message.seqnum = reader.readInt32();
                        break;
                    case 4:
                        message.uid = reader.readInt32();
                        break;
                    case 5:
                        message.flag = reader.readInt32();
                        break;
                    case 6:
                        message.time = reader.readInt64();
                        break;
                    case 7:
                        message.lang = reader.readInt32();
                        break;
                    case 8:
                        message.starttime = reader.readInt32();
                        break;
                    case 9:
                        message.offtime = reader.readInt32();
                        break;
                    case 10:
                        reader.readMessage(message.words, () => pb_1.Message.addToRepeatedWrapperField(message, 10, Word.deserialize(reader), Word));
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
        serializeBinary(): Uint8Array {
            return this.serialize();
        }
        static deserializeBinary(bytes: Uint8Array): Text {
            return Text.deserialize(bytes);
        }
    }
    export class Word extends pb_1.Message {
        #one_of_decls: number[][] = [];
        constructor(data?: any[] | {
            text?: string;
            start_ms?: number;
            duration_ms?: number;
            is_final?: boolean;
            confidence?: number;
        }) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
            if (!Array.isArray(data) && typeof data == "object") {
                if ("text" in data && data.text != undefined) {
                    this.text = data.text;
                }
                if ("start_ms" in data && data.start_ms != undefined) {
                    this.start_ms = data.start_ms;
                }
                if ("duration_ms" in data && data.duration_ms != undefined) {
                    this.duration_ms = data.duration_ms;
                }
                if ("is_final" in data && data.is_final != undefined) {
                    this.is_final = data.is_final;
                }
                if ("confidence" in data && data.confidence != undefined) {
                    this.confidence = data.confidence;
                }
            }
        }
        get text() {
            return pb_1.Message.getFieldWithDefault(this, 1, "") as string;
        }
        set text(value: string) {
            pb_1.Message.setField(this, 1, value);
        }
        get start_ms() {
            return pb_1.Message.getFieldWithDefault(this, 2, 0) as number;
        }
        set start_ms(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        get duration_ms() {
            return pb_1.Message.getFieldWithDefault(this, 3, 0) as number;
        }
        set duration_ms(value: number) {
            pb_1.Message.setField(this, 3, value);
        }
        get is_final() {
            return pb_1.Message.getFieldWithDefault(this, 4, false) as boolean;
        }
        set is_final(value: boolean) {
            pb_1.Message.setField(this, 4, value);
        }
        get confidence() {
            return pb_1.Message.getFieldWithDefault(this, 5, 0) as number;
        }
        set confidence(value: number) {
            pb_1.Message.setField(this, 5, value);
        }
        static fromObject(data: {
            text?: string;
            start_ms?: number;
            duration_ms?: number;
            is_final?: boolean;
            confidence?: number;
        }): Word {
            const message = new Word({});
            if (data.text != null) {
                message.text = data.text;
            }
            if (data.start_ms != null) {
                message.start_ms = data.start_ms;
            }
            if (data.duration_ms != null) {
                message.duration_ms = data.duration_ms;
            }
            if (data.is_final != null) {
                message.is_final = data.is_final;
            }
            if (data.confidence != null) {
                message.confidence = data.confidence;
            }
            return message;
        }
        toObject() {
            const data: {
                text?: string;
                start_ms?: number;
                duration_ms?: number;
                is_final?: boolean;
                confidence?: number;
            } = {};
            if (this.text != null) {
                data.text = this.text;
            }
            if (this.start_ms != null) {
                data.start_ms = this.start_ms;
            }
            if (this.duration_ms != null) {
                data.duration_ms = this.duration_ms;
            }
            if (this.is_final != null) {
                data.is_final = this.is_final;
            }
            if (this.confidence != null) {
                data.confidence = this.confidence;
            }
            return data;
        }
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
            const writer = w || new pb_1.BinaryWriter();
            if (this.text.length)
                writer.writeString(1, this.text);
            if (this.start_ms != 0)
                writer.writeInt32(2, this.start_ms);
            if (this.duration_ms != 0)
                writer.writeInt32(3, this.duration_ms);
            if (this.is_final != false)
                writer.writeBool(4, this.is_final);
            if (this.confidence != 0)
                writer.writeDouble(5, this.confidence);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Word {
            const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new Word();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.text = reader.readString();
                        break;
                    case 2:
                        message.start_ms = reader.readInt32();
                        break;
                    case 3:
                        message.duration_ms = reader.readInt32();
                        break;
                    case 4:
                        message.is_final = reader.readBool();
                        break;
                    case 5:
                        message.confidence = reader.readDouble();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
        serializeBinary(): Uint8Array {
            return this.serialize();
        }
        static deserializeBinary(bytes: Uint8Array): Word {
            return Word.deserialize(bytes);
        }
    }
}