import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleEntity } from './entities/article.entity';
import { Article as ArticleModel } from '@prisma/client';

@Controller('articles')
@ApiTags('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @ApiCreatedResponse({ type: ArticleEntity })
  async createArticle(
    @Body() articleData: CreateArticleDto,
  ): Promise<ArticleModel> {
    const { title, body, description, published } = articleData;
    return new ArticleEntity(
      await this.articlesService.createArticle({
        title,
        body,
        description,
        published,
      }),
    );
  }

  @Get()
  @ApiOkResponse({ type: ArticleEntity, isArray: true })
  async getPublishedArticles(): Promise<ArticleEntity[]> {
    const articles = await this.articlesService.articles({
      where: { published: true },
    });
    return articles.map((article) => new ArticleEntity(article));
  }

  @Get('drafts')
  @ApiOkResponse({ type: ArticleEntity, isArray: true })
  async getUnpublishedArticles(): Promise<ArticleEntity[]> {
    const articles = await this.articlesService.articles({
      where: { published: false },
    });
    return articles.map((article) => new ArticleEntity(article));
  }

  @Get(':id')
  @ApiOkResponse({ type: ArticleEntity })
  async getArticleById(@Param('id') id: string): Promise<ArticleModel> {
    return new ArticleEntity(
      await this.articlesService.article({ id: Number(id) }),
    );
  }

  @Patch(':id')
  @ApiOkResponse({ type: ArticleEntity })
  async updateArticle(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ): Promise<ArticleModel> {
    return new ArticleEntity(
      await this.articlesService.updateArticle({
        where: { id: Number(id) },
        data: updateArticleDto,
      }),
    );
  }

  @Delete(':id')
  @ApiOkResponse({ type: ArticleEntity })
  async deleteArticle(@Param('id') id: string): Promise<ArticleModel> {
    return new ArticleEntity(
      await this.articlesService.deleteArticle({ id: Number(id) }),
    );
  }

  @Get('filtered-articles/:searchString')
  @ApiOkResponse({ type: ArticleEntity, isArray: true })
  async getFilteredArticles(
    @Param('searchString') searchString: string,
  ): Promise<ArticleModel[]> {
    return this.articlesService.articles({
      where: {
        OR: [
          {
            title: { contains: searchString },
          },
          {
            description: { contains: searchString },
          },
        ],
      },
    });
  }
}
