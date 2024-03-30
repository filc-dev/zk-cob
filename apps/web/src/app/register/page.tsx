"use client";
import { BottomCta } from "@/components/bottom-cta";
import { Button } from "@/components/ui/button";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormProvider, useForm } from "react-hook-form";

const Register = () => {
  const forms = useForm();

  return (
    <form
      onSubmit={forms.handleSubmit((values) => {
        console.log(values);
      })}
    >
      <FormProvider {...forms}>
        <div className="flex flex-col py-8 gap-12">
          <div className="flex flex-col gap-8">
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input />
              </FormControl>
            </FormItem>
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input />
              </FormControl>
            </FormItem>
            <FormItem>
              {/** 파티원 인원 수 */}
              <FormLabel>People</FormLabel>
              <div className="flex gap-2">
                <Button size="icon" variant="outline">
                  -
                </Button>
                <Input type="number" className="w-20" />
                <Button size="icon" variant="outline">
                  +
                </Button>
              </div>
            </FormItem>
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea rows={4} />
              </FormControl>
            </FormItem>
          </div>
        </div>
        <BottomCta>
          <Button className="w-full" size="xl">
            Register
          </Button>
        </BottomCta>
      </FormProvider>
    </form>
  );
};

export default Register;
