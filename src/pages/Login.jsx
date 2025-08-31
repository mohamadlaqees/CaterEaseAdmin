import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../validation/loginValidations";
import { useLogInMutation } from "../store/apiSlice/apiSlice";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import LoadingButton from "../components/LoadingButton";
import { Navigate } from "react-router";
import { getFCMToken } from "../util/firebaseUtils";
import { meta } from "@eslint/js";

const Login = () => {
  const token = localStorage.getItem("authToken");

  const [logIn, { isError, isLoading, isSuccess, error }] = useLogInMutation();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const fcmToken = await getFCMToken();
      const response = await logIn(data, {
        meta: { fcmToken: fcmToken },
      }).unwrap();
      console.log(...response);
      if (!response?.data?.message) {
        navigate("/");
      }
    } catch (err) {
      toast.error(err?.data.message, {
        style: {
          background: "white",
          color: "#ef4444",
          border: "1px solid hsl(var(--border))",
        },
      });
    }
  };

  if (token) {
    return <Navigate to={"/"} />;
  }
  return (
    <>
      <Toaster position="top-center" richColors />

      <div className="px-6 sm:my-10 xl:m-0  flex-col xl:flex-row xl:px-10 min-h-screen   flex justify-center items-center gap-10">
        <img
          src="./loginImage.png"
          alt=""
          className="w-full max-w-2xl h-auto rounded-2xl object-cover "
        />
        <section className="w-full max-w-3xl">
          <div className="mb-4">
            <h1 className="text-center  font-serif font-semibold text-4xl lg:text-7xl text-(--primary)">
              CaterEase
            </h1>
            <div className="relative bottom-0 lg:bottom-2 flex items-center justify-center ">
              <div className=" border-t border-[#eeeeee] border-2 w-20 sm:w-32 lg:w-40 "></div>
              <span className="mx-1 text-(--secondaryFont) text-lg">
                Sign in
              </span>
              <div className=" border-t border-[#eeeeee] border-2 w-20 sm:w-32 lg:w-40"></div>
            </div>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 sm:space-y-6 "
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-(--primaryFont) text-base sm:text-lg">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        autoFocus
                        placeholder="Email Address"
                        {...field}
                        className="focus-visible:ring-(--primary) focus:border-0 border-(--border-color) border-2 h-12 placeholder-(--secondaryFont) text-(--secondaryFont)"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-(--primaryFont)  text-base sm:text-lg">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Password"
                        {...field}
                        type="password"
                        className="focus-visible:ring-(--primary) focus:border-0 border-(--border-color) border-2 h-12 placeholder-(--secondaryFont) text-(--secondaryFont) "
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <LoadingButton
                  isButton={true}
                  type={"submit"}
                  btnClass={"w-full sm:w-44 h-10 text-lg cursor-pointer"}
                  disabled={isLoading}
                  loadingText={"Signing In..."}
                  text={"Sign In"}
                />
              </div>
            </form>
          </Form>
        </section>
      </div>
    </>
  );
};

export default Login;
