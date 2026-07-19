import asyncHandler from '../middlewares/asyncHandler.js';

export class ListeningSessionController {
  constructor(service) { this.service = service; }

  getMine = asyncHandler(async (req, res) => res.json(await this.service.getMine(req.user._id)));
  getAllForAdmin = asyncHandler(async (req, res) => res.json(await this.service.getAllForAdmin()));
  getById = asyncHandler(async (req, res) => res.json(await this.service.getOwned(req.params.id, req.user)));
  getReferences = asyncHandler(async (req, res) => res.json(await this.service.getReferences(req.user._id)));
  getInsights = asyncHandler(async (req, res) => res.json(await this.service.getInsights(req.user._id)));
  create = asyncHandler(async (req, res) => res.status(201).json(await this.service.create(req.user._id, req.body)));
  update = asyncHandler(async (req, res) => res.json(await this.service.update(req.params.id, req.user, req.body)));
  delete = asyncHandler(async (req, res) => { await this.service.delete(req.params.id, req.user); res.status(204).send(); });
}
