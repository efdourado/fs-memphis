import asyncHandler from '../middlewares/asyncHandler.js';

export class TagController {
  constructor(tagService) {
    this.tagService = tagService;
  }

  getAllTags = asyncHandler(async (req, res) => {
    const tags = await this.tagService.getAllTags();
    res.json(tags);
  });
  
  createTag = asyncHandler(async (req, res) => {
    const newTag = await this.tagService.createTag(req.body);
    res.status(201).json(newTag);
  });

  getContentByTag = asyncHandler(async (req, res) => {
    const content = await this.tagService.getContentByTag(req.params.slug);
    res.json(content);
}); }