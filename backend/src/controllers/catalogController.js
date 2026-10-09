import asyncHandler from '../middlewares/asyncHandler.js';

export class CatalogController {
  constructor(catalogService, libraryService) {
    this.catalogService = catalogService;
    this.libraryService = libraryService;
  }

  listWorks = asyncHandler(async (req, res) => {
    res.json(await this.catalogService.listWorks());
  });

  getWork = asyncHandler(async (req, res) => {
    res.json(await this.catalogService.getWork(req.params.slug));
  });

  listPeople = asyncHandler(async (req, res) => {
    res.json(await this.catalogService.listPeople());
  });

  getPerson = asyncHandler(async (req, res) => {
    res.json(await this.catalogService.getPerson(req.params.slug));
  });

  compare = asyncHandler(async (req, res) => {
    res.json(await this.catalogService.compare(req.query.a, req.query.b));
  });

  search = asyncHandler(async (req, res) => {
    res.json(await this.catalogService.search(req.query.q));
  });

  updates = asyncHandler(async (req, res) => {
    const library = req.user ? await this.libraryService.rawLibrary(req.user._id) : {};
    res.json(await this.catalogService.updates(library));
  });

  getLibrary = asyncHandler(async (req, res) => {
    res.json(await this.libraryService.getLibrary(req.user._id));
  });

  libraryState = asyncHandler(async (req, res) => {
    res.json(await this.libraryService.state(req.user._id));
  });

  save = asyncHandler(async (req, res) => {
    res.json(await this.libraryService.save(req.user._id, req.params.slug));
  });

  unsave = asyncHandler(async (req, res) => {
    res.json(await this.libraryService.unsave(req.user._id, req.params.slug));
  });

  follow = asyncHandler(async (req, res) => {
    res.json(await this.libraryService.follow(req.user._id, req.params.slug));
  });

  unfollow = asyncHandler(async (req, res) => {
    res.json(await this.libraryService.unfollow(req.user._id, req.params.slug));
  });

  addQuestion = asyncHandler(async (req, res) => {
    res.status(201).json(await this.libraryService.addQuestion(req.user._id, req.body));
  });

  removeQuestion = asyncHandler(async (req, res) => {
    res.json(await this.libraryService.removeQuestion(req.user._id, req.params.id));
  });

  markUpdatesSeen = asyncHandler(async (req, res) => {
    res.json(await this.libraryService.markUpdatesSeen(req.user._id));
  });

  exportData = asyncHandler(async (req, res) => {
    res.setHeader('Content-Disposition', 'attachment; filename="memphis-data.json"');
    res.json(await this.libraryService.exportData(req.user._id));
  });

  deleteAccount = asyncHandler(async (req, res) => {
    res.json(await this.libraryService.deleteAccount(req.user._id));
  });
}
