import asyncHandler from '../middlewares/asyncHandler.js';

export class SearchController {
  constructor(searchService) {
    this.searchService = searchService;
  }

  search = asyncHandler(async (req, res) => {
    const { q } = req.query;
    const results = await this.searchService.search(q);
    res.json(results);
}); }