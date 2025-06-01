export class HttpStatus {
    static readonly CONTINUE = { code: 100, message: "Continue" };
    static readonly SWITCHING_PROTOCOLS = { code: 101, message: "Switching Protocols" };
    static readonly PROCESSING = { code: 102, message: "Processing" };

    static readonly OK = { code: 200, message: "OK" };
    static readonly CREATED = { code: 201, message: "Created" };
    static readonly ACCEPTED = { code: 202, message: "Accepted" };
    static readonly NON_AUTHORITATIVE_INFORMATION = { code: 203, message: "Non-Authoritative Information" };
    static readonly NO_CONTENT = { code: 204, message: "No Content" };
    static readonly RESET_CONTENT = { code: 205, message: "Reset Content" };
    static readonly PARTIAL_CONTENT = { code: 206, message: "Partial Content" };
    static readonly MULTI_STATUS = { code: 207, message: "Multi-Status" };
    static readonly ALREADY_REPORTED = { code: 208, message: "Already Reported" };
    static readonly IM_USED = { code: 226, message: "IM Used" };

    static readonly MULTIPLE_CHOICES = { code: 300, message: "Multiple Choices" };
    static readonly MOVED_PERMANENTLY = { code: 301, message: "Moved Permanently" };
    static readonly FOUND = { code: 302, message: "Found" };
    static readonly SEE_OTHER = { code: 303, message: "See Other" };
    static readonly NOT_MODIFIED = { code: 304, message: "Not Modified" };
    static readonly USE_PROXY = { code: 305, message: "Use Proxy" };
    static readonly TEMPORARY_REDIRECT = { code: 307, message: "Temporary Redirect" };
    static readonly PERMANENT_REDIRECT = { code: 308, message: "Permanent Redirect" };

    static readonly BAD_REQUEST = { code: 400, message: "Bad Request" };
    static readonly UNAUTHORIZED = { code: 401, message: "Unauthorized" };
    static readonly PAYMENT_REQUIRED = { code: 402, message: "Payment Required" };
    static readonly FORBIDDEN = { code: 403, message: "Forbidden" };
    static readonly NOT_FOUND = { code: 404, message: "Not Found" };
    static readonly METHOD_NOT_ALLOWED = { code: 405, message: "Method Not Allowed" };
    static readonly NOT_ACCEPTABLE = { code: 406, message: "Not Acceptable" };
    static readonly PROXY_AUTHENTICATION_REQUIRED = { code: 407, message: "Proxy Authentication Required" };
    static readonly REQUEST_TIMEOUT = { code: 408, message: "Request Timeout" };
    static readonly CONFLICT = { code: 409, message: "Conflict" };
    static readonly GONE = { code: 410, message: "Gone" };
    static readonly LENGTH_REQUIRED = { code: 411, message: "Length Required" };
    static readonly PRECONDITION_FAILED = { code: 412, message: "Precondition Failed" };
    static readonly PAYLOAD_TOO_LARGE = { code: 413, message: "Payload Too Large" };
    static readonly URI_TOO_LONG = { code: 414, message: "URI Too Long" };
    static readonly UNSUPPORTED_MEDIA_TYPE = { code: 415, message: "Unsupported Media Type" };
    static readonly RANGE_NOT_SATISFIABLE = { code: 416, message: "Range Not Satisfiable" };
    static readonly EXPECTATION_FAILED = { code: 417, message: "Expectation Failed" };
    static readonly IM_A_TEAPOT = { code: 418, message: "I'm a teapot" };
    static readonly MISDIRECTED_REQUEST = { code: 421, message: "Misdirected Request" };
    static readonly UNPROCESSABLE_ENTITY = { code: 422, message: "Unprocessable Entity" };
    static readonly LOCKED = { code: 423, message: "Locked" };
    static readonly FAILED_DEPENDENCY = { code: 424, message: "Failed Dependency" };
    static readonly TOO_EARLY = { code: 425, message: "Too Early" };
    static readonly UPGRADE_REQUIRED = { code: 426, message: "Upgrade Required" };
    static readonly PRECONDITION_REQUIRED = { code: 428, message: "Precondition Required" };
    static readonly TOO_MANY_REQUESTS = { code: 429, message: "Too Many Requests" };
    static readonly REQUEST_HEADER_FIELDS_TOO_LARGE = { code: 431, message: "Request Header Fields Too Large" };
    static readonly UNAVAILABLE_FOR_LEGAL_REASONS = { code: 451, message: "Unavailable For Legal Reasons" };

    static readonly INTERNAL_SERVER_ERROR = { code: 500, message: "Internal Server Error" };
    static readonly NOT_IMPLEMENTED = { code: 501, message: "Not Implemented" };
    static readonly BAD_GATEWAY = { code: 502, message: "Bad Gateway" };
    static readonly SERVICE_UNAVAILABLE = { code: 503, message: "Service Unavailable" };
    static readonly GATEWAY_TIMEOUT = { code: 504, message: "Gateway Timeout" };
    static readonly HTTP_VERSION_NOT_SUPPORTED = { code: 505, message: "HTTP Version Not Supported" };
    static readonly VARIANT_ALSO_NEGOTIATES = { code: 506, message: "Variant Also Negotiates" };
    static readonly INSUFFICIENT_STORAGE = { code: 507, message: "Insufficient Storage" };
    static readonly LOOP_DETECTED = { code: 508, message: "Loop Detected" };
    static readonly NOT_EXTENDED = { code: 510, message: "Not Extended" };
    static readonly NETWORK_AUTHENTICATION_REQUIRED = { code: 511, message: "Network Authentication Required" };

    static getMessage(code: number): string | null {
        for (const key of Object.keys(this)) {
            const status = (this as any)[key];
            if (status?.code === code) return status.message;
        }
        return null;
    }
}
