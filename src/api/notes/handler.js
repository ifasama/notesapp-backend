/* eslint no-underscore-dangle: 0 */
const ClientError = require('../../exceptions/ClientError');

class NotesHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postNoteHandler = this.postNoteHandler.bind(this);
    this.getNotesHandler = this.getNotesHandler.bind(this);
    this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this);
    this.putNoteByIdHandler = this.putNoteByIdHandler.bind(this);
    this.deleteNoteByIdHandler = this.deleteNoteByIdHandler.bind(this);
  }

  postNoteHandler(req, h) {
    try {
      this._validator.validateNotePayload(req.payload);
      const { title = 'untitled', body, tags } = req.payload;

      const noteId = this._service.addNote({ title, body, tags });

      const res = h.response({
        status: 'success',
        message: 'catatan berhasil ditambahkan',
        data: {
          noteId,
        },
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

  getNotesHandler() {
    const notes = this._service.getNotes();

    return {
      status: 'success',
      data: {
        notes,
      },
    };
  }

  getNoteByIdHandler(req, h) {
    try {
      const { id } = req.params;
      const note = this._service.getNoteById(id);
      return {
        status: 'success',
        data: {
          note,
        },
      };
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

  putNoteByIdHandler(req, h) {
    try {
      this._validator.validateNotePayload(req.payload);
      const { id } = req.params;

      this._service.editNoteById(id, req.payload);
      return {
        status: 'success',
        messaage: 'catatan berhasil diperbarui',
      };
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

  deleteNoteByIdHandler(req, h) {
    try {
      const { id } = req.params;
      this._service.deleteNoteById(id);

      return {
        status: 'success',
        message: 'catatan berhasil dihapus',
      };
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

module.exports = NotesHandler;
