import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { IdeaService } from '../ideas/idea.service';
import mongoose from 'mongoose';

const homeLayout = "main/home"

@Controller()
export class MainController {
  constructor() {}
  @Get()
  root(@Res() res: Response, @Query() queries: {
    keyword?: string,
    page?: number, l
    limit?: number,
    sort?: string,
    sortMode?: any
  }) {
    return res.render('main/index', { title: "GO Idea - What's your idea?", layout: homeLayout, queries: queries || {} });
  }
  @Get('idea/:id')
  async ideaDetail(@Param('id') id: string, @Res() res: Response) {
    return res.render('main/idea', { ideaId: id.toString(), layout: homeLayout });
  }
  @Get('ideas/upload')
  upload(@Res() res: Response) {
    return res.render('main/idea_upload', { layout: homeLayout, title: "Upload new Idea | GoIdea" });
  }
  @Get('event')
  event(@Res() res: Response) {
    return res.render('main/event_upload', { layout: homeLayout, title: "Events | GoIdea" });
  }

}
