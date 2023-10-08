export const getPagination = (page: number, size: number) => {
    const limit = size ? +size : 3;
    const from = page ? page * limit : 0;
    const to = page ? from + size : size;
  
    return { from, to };
  };

export default defineEventHandler(() => [])

/*export async function getServerSideProps({ query: { page = 1 } }) {
    const { from, to } = getPagination(page, 10);
    const { data, count } = await supabase
      .from("cars")
      .select("*", { count: "exact" })
      .order("id", { ascending: true })
      .range(from, to);
      
    return {
      props: {
        data: data,
        count: count,
        page: +page,
      },
    };
  }*/