import { z} from 'common-deps';

export const postSchema = z.object({
  title: z.string().min(3, { message: "Title minimal 3 karakter" }),

});
