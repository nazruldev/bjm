import { db } from '@config/drizzle';
import { entitas } from '@models/entitas.model';
import { hutang } from '@models/hutang.model';

import { AbstractController } from 'core/http';
import { validate } from 'core/validation';
import { eq, sql } from 'drizzle-orm';
import { Context } from 'hono';
import { postSchema } from 'validations/post.validation';


class PostCrud extends AbstractController {
  async list(c: Context) {
    const result = await validate(c, postSchema);
    // error validasi sudah dikirim di validate()
    console.log(result)

    return this.json(c, { items: [] });
  }

  async create(c: Context) {
    // // const allUsers = await db.select().from(newtable);
    // // const result = await db.execute(`SELECT * FROM newtable`);
    // // const body = await this.jsonBody(c)
    // const insertedUser = await db.insert(newtable)
    //   .values({
    //     asa: "12121"
    //   })
    //   .returning();
    // const allUsers = await db.select().from(newtable);
    // return this.json(c, { insertedUser, allUsers });

    const pageSize = 2;
    const page = 1;

    // Hitung total grup
    const totalDataResult = await db
      .select({
        count: sql<number>`COUNT(*)`
      })
      .from(
        db
          .select({
            entitas_id: entitas.id,
          })
          .from(hutang)
          .innerJoin(entitas, eq(hutang.entitas_id, entitas.id))
          .groupBy(entitas.id)
          .as("subquery_count")
      );

    const totalData = totalDataResult[0].count;
    const totalPages = Math.ceil(totalData / pageSize);

    // Query data dengan agregasi dan pagination
    const data = await db
      .select({
        entitas_id: entitas.id,
        nama_entitas: entitas.nama,
        telepon_entitas: entitas.telepon,
        total_hutang: sql`SUM(${hutang.jumlah_hutang})`,
      })
      .from(hutang)
      .innerJoin(entitas, eq(hutang.entitas_id, entitas.id))
      .groupBy(entitas.id, entitas.nama, entitas.telepon)
      .limit(pageSize)
      .offset((page - 1) * pageSize);



    return this.json(c, {
      data,
      meta: {
        current_page: page,
        per_page: pageSize,
        total_pages: totalPages,
        total_data: totalData,
      },

    });


  }

}

const PostController = new PostCrud();

export { PostController }
