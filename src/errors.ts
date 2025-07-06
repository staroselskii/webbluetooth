export class ATTError extends Error {
    public code: number;
    public type: 'protocol' | 'application' | 'profile' | 'unknown';

    constructor(code: number, message?: string) {
        super(message ?? `Unknown ATT error 0x${code.toString(16)}`);
        let type: ATTError['type'] = 'unknown';

        const protocolErrors: Record<number, string> = {
            0x01: 'Invalid Handle',
            0x02: 'Read Not Permitted',
            0x03: 'Write Not Permitted',
            0x04: 'Invalid PDU',
            0x05: 'Insufficient Authentication',
            0x06: 'Request Not Supported',
            0x07: 'Invalid Offset',
            0x08: 'Insufficient Authorization',
            0x09: 'Prepare Queue Full',
            0x0A: 'Attribute Not Found',
            0x0B: 'Attribute Not Long',
            0x0C: 'Encryption Key Size Too Short',
            0x0D: 'Invalid Attribute Value Length',
            0x0E: 'Unlikely Error',
            0x0F: 'Insufficient Encryption',
            0x10: 'Unsupported Group Type',
            0x11: 'Insufficient Resources',
            0x12: 'Database Out Of Sync',
            0x13: 'Value Not Allowed',
        };

        if (code >= 0x01 && code <= 0x13) {
            type = 'protocol';
            message = `ATT Protocol Error 0x${code.toString(16)}: ${protocolErrors[code] || 'Unknown protocol error'}`;
        } else if (code >= 0x80 && code <= 0x9F) {
            type = 'application';
            message = `ATT Application Error 0x${code.toString(16)}`;
        } else if (code >= 0xE0 && code <= 0xFF) {
            type = 'profile';
            message = `ATT Profile/Service Error 0x${code.toString(16)}`;
        }

        super(message);
        this.code = code;
        this.type = type;
        this.name = 'ATTError';
        Object.setPrototypeOf(this, ATTError.prototype); // crucial for instanceof to work


        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ATTError);
        }
    }
}
