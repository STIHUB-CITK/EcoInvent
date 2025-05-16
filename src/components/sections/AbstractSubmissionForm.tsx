
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Icons } from "@/components/icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Trash2 } from "lucide-react";

const teamMemberSchema = z.object({
  name: z.string().min(2, { message: "Member name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email for the member." }),
});

const submissionFormSchema = z.object({
  participationType: z.enum(['solo', 'team'], {
    required_error: "Please select your participation type.",
  }),
  contactPersonName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  mobileNumber: z.string().min(10, { message: "Please enter a valid mobile number (e.g., 1234567890)." }).max(15, { message: "Mobile number seems too long." }),
  email: z.string().email({ message: "Please enter a valid email address." }),

  teamName: z.string().optional(),
  teamMembers: z.array(teamMemberSchema).max(3, { message: "You can add up to 3 additional team members (total 4 participants)." }).optional(),

  concept: z.string().min(50, { message: "Concept description must be at least 50 characters." }).max(1000, { message: "Concept description must be at most 1000 characters." }),
  objective: z.string().min(30, { message: "Objective must be at least 30 characters." }).max(500, { message: "Objective must be at most 500 characters." }),
  requirements: z.string().min(10, { message: "Please describe requirements." }).max(500, { message: "Requirements description must be at most 500 characters." }),
  technicalApplications: z.string().min(20, { message: "Technical applications must be at least 20 characters." }).max(500, { message: "Technical applications must be at most 500 characters." }),
  slidesLink: z.string().url({ message: "Please enter a valid URL for your presentation slides." }),
}).superRefine((data, ctx) => {
  if (data.participationType === 'team' && (!data.teamName || data.teamName.trim() === "")) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Team name is required for team participation.",
      path: ["teamName"],
    });
  }
});

export type SubmissionFormValues = z.infer<typeof submissionFormSchema>;

const defaultValues: Partial<SubmissionFormValues> = {
  participationType: undefined,
  contactPersonName: "",
  mobileNumber: "",
  email: "",
  teamName: "",
  teamMembers: [],
  concept: "",
  objective: "",
  requirements: "",
  technicalApplications: "",
  slidesLink: "",
};

export function AbstractSubmissionForm() {
  const { toast } = useToast();
  const form = useForm<SubmissionFormValues>({
    resolver: zodResolver(submissionFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "teamMembers",
  });

  const participationType = form.watch("participationType");

  async function onSubmit(data: SubmissionFormValues) {
    // form.formState.isSubmitting is read-only and managed by react-hook-form
    try {
      const response = await fetch('/api/submit-abstract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: "Submission Received!",
          description: "Your abstract has been successfully submitted. We will review it and get back to you.",
          variant: "default",
        });
        form.reset();
      } else {
        const errorData = await response.json();
        toast({
          title: "Submission Error",
          description: errorData.message || "An error occurred while submitting your abstract. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Network Error",
        description: "Could not connect to the server. Please check your internet connection and try again.",
        variant: "destructive",
      });
    }
    // form.formState.isSubmitting is automatically set to false by react-hook-form
  }

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Submission Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="participationType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Participation Type*</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => {
                        field.onChange(value);
                        if (value === 'solo') {
                          form.setValue('teamName', '');
                          form.setValue('teamMembers', []);
                        }
                      }}
                      defaultValue={field.value}
                      className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="solo" />
                        </FormControl>
                        <FormLabel className="font-normal">Solo</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="team" />
                        </FormControl>
                        <FormLabel className="font-normal">Team</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {participationType === 'team' && (
              <FormField
                control={form.control}
                name="teamName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., The Eco Innovators" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="contactPersonName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{participationType === 'team' ? "Team Lead's Full Name*" : "Full Name*"}</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mobileNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{participationType === 'team' ? "Team Lead's Mobile Number*" : "Mobile Number*"}</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="Enter mobile number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{participationType === 'team' ? "Team Lead's Contact Email*" : "Contact Email*"}</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="your.email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {participationType === 'team' && (
              <div className="space-y-4 p-4 border rounded-md">
                <h3 className="text-lg font-medium">Team Members (Max {fields.length + 1}/4)</h3>
                {fields.map((item, index) => (
                  <div key={item.id} className="flex flex-col sm:flex-row gap-4 items-start border-b pb-4 mb-4">
                    <FormField
                      control={form.control}
                      name={`teamMembers.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="flex-grow">
                          <FormLabel>Member {index + 1} Name*</FormLabel>
                          <FormControl>
                            <Input placeholder="Full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`teamMembers.${index}.email`}
                      render={({ field }) => (
                        <FormItem className="flex-grow">
                          <FormLabel>Member {index + 1} Email*</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="member.email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => remove(index)}
                      className="mt-auto sm:mt-6"
                      aria-label="Remove team member"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {fields.length < 3 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => append({ name: "", email: "" })}
                    disabled={fields.length >= 3}
                  >
                    <Icons.Users className="mr-2 h-4 w-4" /> Add Team Member
                  </Button>
                )}
                {fields.length >= 3 && (
                  <p className="text-sm text-muted-foreground">Maximum of 3 additional team members reached (total 4 participants).</p>
                )}
              </div>
            )}

            <FormField
              control={form.control}
              name="concept"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Concept*</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your innovative concept in detail (max 1000 characters)."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="objective"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Objective*</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What are the main objectives of your project? (max 500 characters)"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="requirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hardware/Software Requirements*</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="List any specific hardware or software needed (max 500 characters)."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="technicalApplications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Technical Applications*</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the technical aspects and applications of your project (max 500 characters)."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slidesLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Presentation Slides Link*</FormLabel>
                  <FormControl>
                    <Input placeholder="https://link.to/your/slides (e.g., Google Slides, OneDrive)" {...field} />
                  </FormControl>
                  <FormDescription>
                    Link to your presentation (minimum 5 slides). Ensure it's publicly accessible.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full text-lg py-6" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <>
                  <Icons.RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  <Icons.Send className="mr-2 h-5 w-5" /> Submit Abstract
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}