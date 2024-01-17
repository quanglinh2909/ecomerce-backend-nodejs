const statusCodes = {
    OK: 200,
    CREATED: 201
};
const reasponsStatusCode = {
    OK: 'Success',
    CREATED: 'Created!'
};
class SuccessResponse {
    constructor({
        message,
        statusCodes = statusCodes.OK,
        reasponsStatusCode = reasponsStatusCode.OK,
        metadata = {},
        options = {}
    }) {
        this.message = message;
        this.statusCodes = statusCodes;
        this.reasponsStatusCode = reasponsStatusCode;
        this.metadata = metadata;
        this.options = options;
    }
    send(res, headers = {}) {
        return res.status(this.statusCodes).json(this);
    }
}

class OK extends SuccessResponse {
    constructor({ message, metadata, options = {} }) {
        super({
            message,
            statusCodes: statusCodes.OK,
            reasponsStatusCode: reasponsStatusCode.OK,
            metadata,
            options
        });
    }
}

class CREATED extends SuccessResponse {
    constructor({ message, metadata, options = {} }) {
        super({
            message,
            statusCodes: statusCodes.CREATED,
            reasponsStatusCode: reasponsStatusCode.CREATED,
            metadata,
            options
        });
    }
}

module.exports = {
    SuccessResponse,
    OK,
    CREATED
};
