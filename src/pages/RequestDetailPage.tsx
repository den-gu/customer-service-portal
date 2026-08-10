import React from 'react';
import type { ServiceRequestStatus } from '../types/serviceRequest';
import { CardDescription, CardTitle } from '@/components/ui/card';
import Main from '@/containers/main';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft02Icon, Loading03Icon, User02Icon } from '@hugeicons/core-free-icons';
import { AnimatePresence, motion } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useServiceRequestDetail, useUpdateServiceRequestStatus } from '@/hooks/useServiceRequests';
import { Badge } from '@/components/ui/badge';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Field, FieldError } from '@/components/ui/field';
import { toast } from '@/components/ui/toast';
import { Empty, EmptyHeader, EmptyTitle } from '@/components/ui/empty';

// Definir o schema
const updateStatusSchema = z.object({
  status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'], {
    message: 'Please select a valid status.',
  }),
  note: z
    .string()
    .max(250, 'Note cannot exceed 250 characters.')
    .optional(),
});

export type UpdateStatusFormValues = z.infer<typeof updateStatusSchema>;

// 2. Componente da Secção de Actualização de Status
interface UpdateStatusSectionProps {
  request: {
    status: ServiceRequestStatus;
    version: number;
  };
  updateStatusMutation: ReturnType<typeof useUpdateServiceRequestStatus>;
}

const UpdateStatusSection: React.FC<UpdateStatusSectionProps> = ({
  request,
  updateStatusMutation,
}) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<UpdateStatusFormValues>({
    resolver: zodResolver(updateStatusSchema),
    defaultValues: {
      status: undefined,
      note: '',
    },
  });

  const noteValue = watch('note') || '';

  const onSubmit = (data: UpdateStatusFormValues) => {
    updateStatusMutation.mutate(
      {
        status: data.status,
        version: request.version,
        note: data.note || undefined,
      },
      {
        onSuccess: () => {
          reset();
          const id = toast.add({
            title: "Status updated successfully",
            actionProps: {
              onClick() {
                toast.close(id)
              },
            },
          })
        },
      }
    );
  };

  // Mapeamento de transições de status permitidas pela regra de negócio
  const availableStatuses = React.useMemo(() => {
    switch (request.status) {
      case 'OPEN':
        return [
          { label: 'IN_PROGRESS', value: 'IN_PROGRESS' },
          { label: 'CLOSED', value: 'CLOSED' },
        ];
      case 'IN_PROGRESS':
        return [
          { label: 'RESOLVED', value: 'RESOLVED' },
          { label: 'OPEN', value: 'OPEN' },
        ];
      case 'RESOLVED':
        return [
          { label: 'CLOSED', value: 'CLOSED' },
          { label: 'IN_PROGRESS', value: 'IN_PROGRESS' },
        ];
      default:
        return [];
    }
  }, [request.status]);

  if (request.status === 'CLOSED') {
    return (
      <p className="text-sm text-zinc-500 italic mt-6">
        Esta solicitação encontra-se no estado FINAL (CLOSED) e não pode ser alterada.
      </p>
    );
  }

  return (
    <section className="mt-8 space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* Campo de Seleção de Status via Controller */}
        <div className="flex gap-6 justify-between items-center">
          <CardTitle className="text-lg font-medium pt-2">
            Edit status
          </CardTitle>

          <Controller
            name="status"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className='w-fit'>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="px-5 rounded-lg bg-transparent w-full md:w-40">
                    <SelectValue placeholder="Status..." />
                  </SelectTrigger>
                  <SelectContent className="w-full h-auto shadow-md">
                    <SelectGroup className="p-2">
                      {availableStatuses.map((opt) => (
                        <SelectItem
                          key={opt.value}
                          value={opt.value}
                          className="rounded-xl text-sm cursor-pointer"
                        >
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
        </div>

        {/* Campo Nota / Comentário Opcional */}
        <div>
          <CardTitle className="flex items-center justify-between text-sm font-medium">
            Note (Optional)
            <span className="text-xs text-muted-foreground font-normal">
              {noteValue.length} / 250
            </span>
          </CardTitle>
          <Field data-invalid={!!errors.note} className="mt-2">
            <Textarea
              placeholder=""
              rows={4}
              maxLength={250}
              {...register('note')}
              className="w-full py-3 px-0 text-sm bg-transparent rounded-none border-none focus-visible:ring-0 resize-none"
            />
            {errors.note && <FieldError>{errors.note.message}</FieldError>}
          </Field>
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'circOut' }}
            className="h-px w-full bg-linear-to-r from-transparent via-zinc-300 to-transparent mb-1"
          />
        </div>

        {/* Botão de Submissão */}
        <div className="flex items-center justify-end">
          <Button
            type="submit"
            disabled={updateStatusMutation.isPending}
            className=""
          >
            {updateStatusMutation.isPending ? 'Updating...' : 'Save changes'}
          </Button>
        </div>

        {/* Mensagens de Feedback do Tanstack/React Query */}
        {updateStatusMutation.isError && (
          <CardTitle className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
            Erro ao atualizar status. Conflito de versão ou transição não permitida.
          </CardTitle>
        )}
      </form>
    </section>
  );
};


export const RequestDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { requestId = '' } = useParams<{ requestId: string }>();
  const { data: request, isLoading, isError } = useServiceRequestDetail(requestId);
  const updateStatusMutation = useUpdateServiceRequestStatus(requestId);

  if (isLoading) return <div className='w-full h-screen grid place-items-center'>
    <HugeiconsIcon icon={Loading03Icon} size={26} strokeWidth={1.5} className="text-zinc-600 shrink-0 animate-spin" />
  </div>;

  if (isError || !request) {
    return (
      <div className='w-full h-screen grid place-items-center'>
        <Empty>
          <EmptyHeader>
            <EmptyTitle>Request not found!</EmptyTitle>
          </EmptyHeader>
          <Button variant="link" className="text-muted-foreground" size="sm" nativeButton={false} render={<Link to="/">
            <HugeiconsIcon icon={ArrowLeft02Icon} size={26} strokeWidth={1.5} className="text-zinc-600 shrink-0" />
            Go to Home
          </Link>} />
        </Empty>
      </div>
    );
  }

  return (
    <Main initialExpanded={false}>
      <div className="w-full max-w-7xl mx-auto min-h-screen relative px-4 sm:px-6 xl:px-20">
        <div>
          <div className="py-8 min-h-screen h-full bg-white">
            <div className="h-full lg:py-10 space-y-8">
              <div className='flex items-center gap-6 bg-white'>
                <Button
                  onClick={() => navigate(-1)}
                  variant="ghost" size="icon" aria-label="Previous page" className='rounded-full cursor-pointer'>
                  <HugeiconsIcon icon={ArrowLeft02Icon} strokeWidth={1.5} className="shrink-0 text-zinc-600 size-6" />
                </Button>
                <div>
                  <CardTitle className="mt-0 text-xl md:text-2xl font-semibold">
                    Request {requestId}
                  </CardTitle>
                </div>
              </div>

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
                    <div className="w-full flex flex-col gap-8 max-w-4xl">
                      <div className='space-y-4'>
                        <div className='flex items-center gap-6'>
                          <div className="w-15 h-15 p-2 grid place-items-center rounded-full bg-zinc-200 shrink-0">
                            <HugeiconsIcon icon={User02Icon} size={26} strokeWidth={1.5} className="text-zinc-600 shrink-0" />
                          </div>
                          <div>
                            <CardTitle className="text-lg font-medium">
                              {request.requesterName}
                            </CardTitle>
                            <CardDescription className="text-sm">
                              {request.requesterEmail}
                            </CardDescription>
                          </div>
                        </div>
                        <CardTitle className="mt-6 text-2xl font-medium flex items-center gap-4">
                          {request.title}
                          <Badge variant="outline" className='text-sm p-2 h-8'>{request.category}</Badge>
                        </CardTitle>
                        <CardDescription className="mt-2 text-base">
                          {request.description}
                        </CardDescription>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
                          <div>
                            <CardTitle className="mt-6 text-sm font-medium flex items-center gap-4">
                              Priority
                            </CardTitle>
                            <CardDescription className="mt-2 text-sm">
                              {request.priority}
                            </CardDescription>
                          </div>
                          <div>
                            <CardTitle className="mt-6 text-sm font-medium flex items-center gap-4">
                              Status
                            </CardTitle>
                            <CardDescription className="mt-2 text-sm">
                              {request.status}
                            </CardDescription>
                          </div>
                          <div>
                            <CardTitle className="mt-6 text-sm font-medium flex items-center gap-4">
                              Version
                            </CardTitle>
                            <CardDescription className="mt-2 text-sm">
                              {request.version}
                            </CardDescription>
                          </div>
                          <div>
                            <CardTitle className="mt-6 text-sm font-medium flex items-center gap-4">
                              Created at
                            </CardTitle>
                            <CardDescription className="mt-2 text-sm">
                              {new Date(request.createdAt).toLocaleString()}
                            </CardDescription>
                          </div>
                          <div>
                            <CardTitle className="mt-6 text-sm font-medium flex items-center gap-4">
                              Last update
                            </CardTitle>
                            <CardDescription className="mt-2 text-sm">
                              {new Date(request.updatedAt).toLocaleString()}
                            </CardDescription>
                          </div>
                        </div>
                      </div>

                      {/* Sub-componente de formulário para actualizacao de status */}
                      <UpdateStatusSection
                        request={request}
                        updateStatusMutation={updateStatusMutation}
                      />
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