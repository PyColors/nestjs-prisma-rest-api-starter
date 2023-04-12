import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Article, Prisma } from '@prisma/client';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  // CRUD operations
  async articles(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ArticleWhereUniqueInput;
    where?: Prisma.ArticleWhereInput;
    orderBy?: Prisma.ArticleOrderByWithRelationInput;
  }): Promise<Article[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.article.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  article(
    articleWhereUniqueInput: Prisma.ArticleWhereUniqueInput,
  ): Promise<Article | null> {
    return this.prisma.article.findUnique({
      where: articleWhereUniqueInput,
      include: {
        author: true,
      },
    });
  }

  createArticle(data: Prisma.ArticleCreateInput): Promise<Article> {
    return this.prisma.article.create({
      data,
    });
  }

  updateArticle(params: {
    where: Prisma.ArticleWhereUniqueInput;
    data: Prisma.ArticleUpdateInput;
  }): Promise<Article> {
    const { data, where } = params;
    return this.prisma.article.update({
      data,
      where,
    });
  }

  deleteArticle(where: Prisma.ArticleWhereUniqueInput): Promise<Article> {
    return this.prisma.article.delete({
      where,
    });
  }
}
