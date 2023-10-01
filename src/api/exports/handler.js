const ClientError = require('../../exceptions/ClientError');

class ExportsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postExportNotesHandler = this.postExportNotesHandler.bind(this);
  }

  async postExportNotesHandler(req, h) {
    try {
      this._validator.validateExportNotesPayload(req.payload);
      const message = {
        userId: req.auth.credentials.id,
        targetEmail: req.payload.targetEmail,
      };

      await this._service.sendMessage('export:notes', JSON.stringify(message));

      const res = h.response({
        status: 'success',
        message: 'Permintaan anda dalam antrean',
      });
      res.code(201);
      return res;
    } catch (error) {
      if (error instanceof ClientError) {
        const res = h.response({
          status: 'fail',
          message: error.message,
        });
        res.code(error.statusCode);
        return res;
      }

      // SERVER ERROR
      const res = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      res.code(500);
      console.error(error);
      return res;
    }
  }
}

module.exports = ExportsHandler;
