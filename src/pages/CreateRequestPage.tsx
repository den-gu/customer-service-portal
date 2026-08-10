import React from 'react';
import { CardDescription, CardTitle } from '@/components/ui/card';
import Main from '@/containers/main';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft02Icon } from '@hugeicons/core-free-icons';
import { AnimatePresence, motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useCreateServiceRequest } from '@/hooks/useServiceRequests';
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { InputGroup, InputGroupTextarea } from '@/components/ui/input-group';
import { toast } from '@/components/ui/toast';

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters.'),
  requesterName: z.string().min(2, 'Requester name is required.'),
  requesterEmail: z.email('Please enter a valid email address.'),
  category: z.string().min(1, 'Please select a category.'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], {
    message: 'Please select a priority.',
  }),
})

export const CreateRequestPage: React.FC = () => {

  const navigate = useNavigate();
  const createMutation = useCreateServiceRequest();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      requesterName: '',
      requesterEmail: '',
      category: '',
      priority: 'MEDIUM',
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    // Do something with the form values.
    console.log(data)
    createMutation.mutate(
      {
        title: data.title,
        description: data.description,
        category: data.category,
        priority: data.priority,
        requesterName: data.requesterName,
        requesterEmail: data.requesterEmail,
      },
      {
        onSuccess: () => {
          const id = toast.add({
            title: "Service request created",
            actionProps: {
              // children: "Undo",
              onClick() {
                toast.close(id)
              },
            },
          })
          navigate('/');
        },
      }
    );
  }

  return (
    <Main initialExpanded={false}>
      <div className="w-full max-w-7xl mx-auto min-h-screen relative px-4 sm:px-6 xl:px-20">
        <div>
          <div className="py-8 min-h-screen h-full bg-white">
            <div className="h-full lg:py-10 space-y-10">
              <div className='flex items-center gap-6 bg-white'>
                <Button
                  type='button'
                  onClick={() => navigate(-1)}
                  variant="ghost" size="icon" aria-label="Previous page" className='rounded-full cursor-pointer'>
                  <HugeiconsIcon icon={ArrowLeft02Icon} strokeWidth={1.5} className="shrink-0 text-zinc-600 size-6" />
                </Button>
                <div>
                  <CardTitle className="mt-0 text-xl md:text-2xl font-semibold">
                    New Request
                  </CardTitle>
                  <CardDescription className="mt-1 text-sm">
                    Required fields (*).
                  </CardDescription>
                </div>
              </div>

              {/* Painel de Filtros, Pesquisa, e Tabela de Dados */}
              <div className='space-y-4'>
                <AnimatePresence mode="wait">
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="flex flex-col gap-10 mt-2 w-full"
                  >
                    <div className="w-full flex flex-col gap-8 max-w-3xl">
                      <form id="formCreateRequest" onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup>
                          <Controller
                            name="title"
                            control={form.control}
                            render={({ field, fieldState }) => (
                              <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="formTitle">
                                  Title *
                                </FieldLabel>
                                <Input
                                  {...field}
                                  id="formTitle"
                                  aria-invalid={fieldState.invalid}
                                  autoComplete="off"
                                />
                                {fieldState.invalid && (
                                  <FieldError errors={[fieldState.error]} />
                                )}
                              </Field>
                            )}
                          />
                          <Controller
                            name="description"
                            control={form.control}
                            render={({ field, fieldState }) => (
                              <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="formDescription">
                                  Description *
                                </FieldLabel>
                                <InputGroup>
                                  <InputGroupTextarea
                                    {...field}
                                    id="formDescription"
                                    placeholder="Describe what's happening..."
                                    rows={6}
                                    className="min-h-24 resize-none"
                                    aria-invalid={fieldState.invalid}
                                  />
                                </InputGroup>
                                {fieldState.invalid && (
                                  <FieldError errors={[fieldState.error]} />
                                )}
                              </Field>
                            )}
                          />
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Controller
                              name="requesterName"
                              control={form.control}
                              render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                  <FieldLabel htmlFor="formRequesterName">
                                    Requester Name *
                                  </FieldLabel>
                                  <Input
                                    {...field}
                                    id="formRequesterName"
                                    aria-invalid={fieldState.invalid}
                                    autoComplete="off"
                                  />
                                  {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                  )}
                                </Field>
                              )}
                            />
                            <Controller
                              name="requesterEmail"
                              control={form.control}
                              render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                  <FieldLabel htmlFor="formRequesterEmail">
                                    Requester E-mail *
                                  </FieldLabel>
                                  <Input
                                    {...field}
                                    id="formRequesterEmail"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="example@email.com"
                                    autoComplete="off"
                                  />
                                  {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                  )}
                                </Field>
                              )}
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Controller
                              name="category"
                              control={form.control}
                              render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                  <FieldLabel htmlFor="formCategory">
                                    Category *
                                  </FieldLabel>
                                  <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    aria-invalid={fieldState.invalid}
                                    autoComplete="off"
                                  >
                                    <SelectTrigger id="formCategory" className="w-full px-5">
                                      <SelectValue placeholder="Access, Billing, Network" />
                                    </SelectTrigger>
                                    <SelectContent className="w-full h-auto shadow-md">
                                      <SelectGroup className="p-2">
                                        <SelectItem value="Access" className="rounded-xl text-sm cursor-pointer">
                                          Access
                                        </SelectItem>
                                        <SelectItem value="Billing" className="rounded-xl text-sm cursor-pointer">
                                          Billing
                                        </SelectItem>
                                        <SelectItem value="Network" className="rounded-xl text-sm cursor-pointer">
                                          Network
                                        </SelectItem>
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>
                                  {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                  )}
                                </Field>
                              )}
                            />
                            <Controller
                              name="priority"
                              control={form.control}
                              render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                  <FieldLabel htmlFor="formPriority">
                                    Priority *
                                  </FieldLabel>
                                  <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    aria-invalid={fieldState.invalid}
                                    autoComplete="off"
                                  >
                                    <SelectTrigger id="formPriority" className="w-full px-5">
                                      <SelectValue placeholder="Low, Medium, High, Critical" />
                                    </SelectTrigger>
                                    <SelectContent className="w-full h-auto shadow-md">
                                      <SelectGroup className="p-2">
                                        <SelectItem value="LOW" className="rounded-xl text-sm cursor-pointer">
                                          Low
                                        </SelectItem>
                                        <SelectItem value="MEDIUM" className="rounded-xl text-sm cursor-pointer">
                                          Medium
                                        </SelectItem>
                                        <SelectItem value="HIGH" className="rounded-xl text-sm cursor-pointer">
                                          High
                                        </SelectItem>
                                        <SelectItem value="CRITICAL" className="rounded-xl text-sm cursor-pointer">
                                          Critical
                                        </SelectItem>
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>
                                  {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                  )}
                                </Field>
                              )}
                            />
                          </div>
                        </FieldGroup>
                        <Field orientation="horizontal" className='flex justify-end mt-8'>
                          <Button type="button" variant="outline" onClick={() => form.reset()}>
                            Reset
                          </Button>
                          <Button type="submit" disabled={createMutation.isPending} form="formCreateRequest">
                            {createMutation.isPending ? 'Processing...' : 'Create request'}
                          </Button>
                        </Field>
                      </form>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Main>
  );
};