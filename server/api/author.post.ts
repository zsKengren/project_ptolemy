export default defineEventHandler(async (event) => {
    const { name, description, birthdate, deathdate, image, pen_names } = await readBody(event);
  
    if (!name)
      throw createError({
        message: "Missing fields!",
        statusCode: 400,
      });
  
    const client = useTurso();
  
    await client.execute({
      sql: "insert into author(name, description, birthdate, deathdate, image, pen_names) values(?, ?, ?, ?, ?, ?)",
      args: [name, description, birthdate, deathdate, image, pen_names],
    });
  
    const author = await client.execute({
      sql: "select * from author where name = ?",
      args: [name],
    });
  
    return {
      message: "Author added!",
      data: author.rows,
    };
  });