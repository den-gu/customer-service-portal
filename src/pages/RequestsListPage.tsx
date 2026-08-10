import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import { useServiceRequests } from '../hooks/useServiceRequests';
import type { ServiceRequestStatus, ServiceRequestPriority } from '../types/serviceRequest';
import { CardDescription, CardTitle } from '@/components/ui/card';
import Main from '@/containers/main';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { HugeiconsIcon } from '@hugeicons/react';
import { ChatAdd01Icon, ChevronLeftIcon, ChevronRightIcon, Logout02Icon, Search01Icon } from '@hugeicons/core-free-icons';
import { Badge } from '@/components/ui/badge';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const statusList = [
  { label: "Show all", value: "ALL" },
  { label: "Open", value: "OPEN" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Resolved", value: "RESOLVED" },
  { label: "Closed", value: "CLOSED" }
]

const prioritiesList = [
  { label: "Show all", value: "ALL" },
  { label: "Low", value: "LOW" },
  { label: "Medium", value: "MEDIUM" },
  { label: "High", value: "HIGH" },
  { label: "Critical", value: "CRITICAL" }
]

const orderByDate = [
  { label: "Order by date", value: "" },
  { label: "Newest", value: "-createdAt" },
  { label: "Oldest", value: "createdAt" }
]

export const RequestsListPage: React.FC = () => {
  const auth = useAuth();

  // Estados locais para filtros e paginação
  const [search, setSearch] = useState('');

  const [status, setStatus] = useState<ServiceRequestStatus | ''>('');
  const [priority, setPriority] = useState<ServiceRequestPriority | ''>('');

  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);

  const { data,
    isLoading, isError, error
  } = useServiceRequests({
    search: search || undefined,
    status: status || undefined,
    priority: priority || undefined,
    sort,
    page,
    pageSize: 10,
  });

  const countPages = data?.totalPages || 1;
  const countResults = data?.total || 0;

  return (
    <Main initialExpanded={false}>
      <div className="w-full max-w-7xl mx-auto min-h-screen relative px-4 sm:px-6 xl:px-20">

        <Button
          variant="default"
          className="fixed bottom-10 right-6 z-100"
          nativeButton={false}
          render={
            <Link to="/requests/new" className="flex items-center gap-2 px-4">
              <HugeiconsIcon icon={ChatAdd01Icon} size={20} className="shrink-0" />
              New Request
            </Link>}>
        </Button>
        <div>
          <div className="py-8 min-h-screen h-full bg-white">
            <div className="h-full py-10 space-y-10">
              <div className='sticky top-0 left-0 flex items-center justify-between bg-white'>
                <div>
                  <CardTitle className="mt-0 text-xl md:text-2xl font-semibold">
                    Welcome to CSR - Portal!
                  </CardTitle>
                  <CardDescription className="mt-1 text-base">
                    Here's a list of costumer service requests.
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger render={
                    <Avatar className="w-9 md:w-10 h-9 md:h-10 cursor-pointer">
                      <AvatarImage src="/" />
                      <AvatarFallback className="bg-zinc-100 text-lg md:text-xl font-medium">{auth.user?.profile?.name?.charAt(0) || auth.user?.profile.email?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  } nativeButton={false} />
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuGroup>
                      <DropdownMenuItem variant="destructive">
                        {/* Logout */}
                        <Button
                          type='button'
                          variant={'destructive'}
                          size={'xs'}
                          onClick={() => void auth.removeUser()}
                          className="bg-transparent hover:bg-transparent text-base"
                        >
                          <HugeiconsIcon
                            icon={Logout02Icon}
                            size={24}
                            strokeWidth={1.5}
                            className={`shrink-0 size-5 hover:text-primary text-zinc-600 group-hover:text-primary/90`}
                          />
                          Logout
                        </Button>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Painel de Filtros, Pesquisa, e Tabela de Dados */}
              <div className='space-y-4.5'>
                <CardTitle className="text-base md:text-lg font-semibold">
                  Filters
                </CardTitle>
                <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] items-center gap-5 md:gap-3">
                  <div className='flex flex-col md:flex-row items-center gap-3 md:gap-2'>
                    <InputGroup className="md:max-w-xs rounded-lg">
                      <InputGroupInput
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        placeholder="Search by title or requester name.." />
                      <InputGroupAddon>
                        <HugeiconsIcon icon={Search01Icon} className="shrink-0 size-5" />
                      </InputGroupAddon>
                      <InputGroupAddon align="inline-end">{search && countResults + ' result (s)'}</InputGroupAddon>
                    </InputGroup>
                  </div>
                  <div className='flex flex-col md:flex-row items-center md:justify-end gap-3'>
                    <Select
                      items={statusList}
                      value={status || "Status"}
                      onValueChange={(value) => {
                        setStatus(value === "ALL" ? "" : (value as ServiceRequestStatus));
                        setPage(1);
                      }}
                    >
                      <SelectTrigger className="w-full md:w-fit bg-transparent rounded-lg">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent className="shadow-md">
                        <SelectGroup>
                          {statusList.map((item) => (
                            <SelectItem key={item.value} value={item.value}
                              onChange={() => setStatus(item.value as ServiceRequestStatus)}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Select
                      items={prioritiesList}
                      value={priority || "Priority"}
                      onValueChange={(value) => {
                        setPriority(value === "ALL" ? "" : (value as ServiceRequestPriority));
                        setPage(1);
                      }}
                    >
                      <SelectTrigger className="w-full md:w-fit bg-transparent rounded-lg">
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent className="shadow-md">
                        <SelectGroup>
                          {prioritiesList.map((item) => (
                            <SelectItem key={item.value} value={item.value}
                              onChange={() => setPriority(item.value as ServiceRequestPriority)}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    <Select
                      items={orderByDate}
                      value={sort || "Order by date"}
                      onValueChange={(value) =>
                        setSort(value || "")
                      }
                    >
                      <SelectTrigger className="w-full md:w-fit bg-transparent rounded-lg">
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent className="shadow-md">
                        <SelectGroup>
                          {orderByDate.map((item) => (
                            <SelectItem key={item.value} value={item.value}
                            >
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className='border border-zinc-200 rounded-lg overflow-hidden'>
                  <Table>
                    <TableHeader className='bg-zinc-50'>
                      <TableRow>
                        <TableHead className="w-25">Request</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Requester</TableHead>
                        <TableHead>
                          <div className="flex items-center gap-2">
                            Status
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center gap-2">
                            Priority
                          </div>
                        </TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className='text-sm'>
                      {data && data.items.length > 0 && data.items.map((req) => (
                        <TableRow key={req.id}>
                          <TableCell className="font-medium">{req.id}</TableCell>
                          <TableCell>
                            <Link to={`/requests/${req.id}`} className='font-medium flex items-center gap-2'>
                              <Badge variant="outline" className='h-7'>{req.category}</Badge>
                              <span className='hover:underline'>{req.title}</span></Link>
                          </TableCell>
                          <TableCell>{req.requesterName}</TableCell>
                          <TableCell>{req.status}</TableCell>
                          <TableCell className='capitalize flex items-center gap-2'>
                            {req.priority.toLowerCase()}</TableCell>
                          <TableCell>{new Date(req.createdAt).toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                      {data && data.items.length === 0 && (
                        <TableRow className='hover:bg-transparent'>
                          <TableCell colSpan={12}>
                            {isLoading && (
                              <div className="p-12 text-center text-slate-500 font-medium">
                                A carregar solicitações de atendimento...
                              </div>
                            )}

                            {isError && (
                              <div className="p-6 bg-rose-50 text-rose-700 text-sm border-l-4 border-rose-500">
                                Erro ao carregar solicitações: {error instanceof Error ? error.message : 'Falha na comunicação com o servidor.'}
                              </div>
                            )}
                            <div className="w-full p-12 text-center text-slate-500">
                              Nenhuma solicitação encontrada com os filtros actuais.
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                {/* Rodapé de Paginação */}
                {data
                  && data.items.length > 0
                  && <div className='flex items-center justify-between mt-4'>
                    <CardTitle className="mt-0 text-sm">
                      Page {data?.page} of {data?.totalPages} ({data?.total} records)
                    </CardTitle>

                    <div className="flex items-center gap-3">
                      <Button disabled={page <= 1}
                        onClick={() => setPage((p) => p - 1)}
                        variant="outline" size="icon" aria-label="Previous page" className='rounded-lg'>
                        <HugeiconsIcon icon={ChevronLeftIcon} size={16} strokeWidth={1.5} className="shrink-0" />
                      </Button>
                      <Button disabled={page >= countPages}
                        onClick={() => setPage((p) => p + 1)}
                        variant="outline" size="icon" aria-label="Next page" className='rounded-lg'>
                        <HugeiconsIcon icon={ChevronRightIcon} size={16} strokeWidth={1.5} className="shrink-0" />
                      </Button>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </Main >
  );
};