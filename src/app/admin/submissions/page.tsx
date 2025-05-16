
"use client";

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns'; // For date formatting
import { Separator } from '@/components/ui/separator';


interface TeamMember {
  name: string;
  email: string;
}
// Define the type for a single submission, matching the API response
interface Submission {
  id: number;
  participationType: 'solo' | 'team';
  contactPersonName: string;
  mobileNumber: string;
  email: string;
  teamName?: string | null;
  concept: string;
  objective: string;
  requirements: string;
  technicalApplications: string;
  slidesLink: string;
  submissionTimestamp: string; // Assuming it's an ISO string
  teamMemberCount: number; // Count of *additional* members (excluding lead)
  teamMembers?: TeamMember[]; // Details of *additional* members
}

export default function AdminSubmissionsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (localStorage.getItem('isAdminLoggedIn') !== 'true') {
      router.replace('/admin/login');
    } else {
      fetchSubmissions();
    }
  }, [router]);

  async function fetchSubmissions() {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/submissions');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch submissions');
      }
      const data = await response.json();
      setSubmissions(data.submissions || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast({
        title: 'Error Fetching Submissions',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
    router.push('/admin/login');
  };

  const handleExportData = () => {
    if (submissions.length === 0) {
      toast({ title: 'No Data', description: 'No submissions to export.', variant: 'destructive' });
      return;
    }

    // Define the maximum number of team members from the data to create dynamic headers
    const maxTeamMembers = submissions.reduce((max, s) =>
      s.teamMembers && s.teamMembers.length > max ? s.teamMembers.length : max,
      0);

    const headers = [
      "ID", "Participation Type", "Contact Name", "Mobile", "Email", "Team Name",
      "Total Team Size", // Calculated: lead + teamMemberCount
      "Concept", "Objective", "Requirements", "Tech Applications",
      "Slides Link", "Submission Timestamp"
    ];

    for (let i = 1; i <= maxTeamMembers; i++) {
      headers.push(`Member ${i + 1} Name`, `Member ${i + 1} Email`);
    }

    const csvRows = [
      headers.join(','),
      ...submissions.map(s => {
        const rowData = [
          s.id,
          s.participationType,
          `"${s.contactPersonName.replace(/"/g, '""')}"`,
          s.mobileNumber,
          s.email,
          s.teamName ? `"${s.teamName.replace(/"/g, '""')}"` : '',
          s.participationType === 'team' ? s.teamMemberCount + 1 : 1, // Total team size
          `"${s.concept.replace(/"/g, '""')}"`,
          `"${s.objective.replace(/"/g, '""')}"`,
          `"${s.requirements.replace(/"/g, '""')}"`,
          `"${s.technicalApplications.replace(/"/g, '""')}"`,
          s.slidesLink,
          format(new Date(s.submissionTimestamp), "yyyy-MM-dd HH:mm:ss")
        ];

        if (s.participationType === 'team' && s.teamMembers) {
          for (let i = 0; i < maxTeamMembers; i++) {
            if (s.teamMembers[i]) {
              rowData.push(`"${s.teamMembers[i].name.replace(/"/g, '""')}"`, s.teamMembers[i].email);
            } else {
              rowData.push('', ''); // Empty cells if member doesn't exist
            }
          }
        } else {
          for (let i = 0; i < maxTeamMembers; i++) {
            rowData.push('', '');
          }
        }
        return rowData.join(',');
      })
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `ecoinvent_submissions_${format(new Date(), "yyyyMMdd_HHmmss")}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast({ title: 'Export Successful', description: 'Submissions exported as CSV.' });
    } else {
      toast({ title: 'Export Failed', description: 'Your browser does not support this export method.', variant: 'destructive' });
    }
  };

  const handleViewSubmission = (submission: Submission) => {
    setSelectedSubmission(submission);
    setIsViewDialogOpen(true);
  };

  if (!isMounted) {
    return <div className="flex justify-center items-center min-h-screen"><Icons.RefreshCw className="h-8 w-8 animate-spin text-primary" /></div>;
  }
  if (localStorage.getItem('isAdminLoggedIn') !== 'true') {
    return null; // Will be redirected by useEffect
  }

  return (
    <>
      <div className="container mx-auto py-8">
        <Card className="shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold text-primary">Admin Dashboard</CardTitle>
              <CardDescription>View and manage EcoInvent submissions.</CardDescription>
            </div>
            <div className="space-x-2">
              <Button onClick={handleExportData} variant="outline">
                <Icons.FileText className="mr-2 h-4 w-4" />
                Export Data (CSV)
              </Button>
              <Button onClick={handleLogout} variant="destructive">
                <Icons.LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-10">
                <Icons.RefreshCw className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-4 text-muted-foreground">Loading submissions...</p>
              </div>
            ) : submissions.length === 0 ? (
              <div className="text-center py-10">
                <Icons.HelpCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-xl text-muted-foreground">No submissions found.</p>
              </div>
            ) : (
              <Table>
                <TableCaption>A list of all abstract submissions.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Contact Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Team Name</TableHead>
                    <TableHead className="text-center">Total Members</TableHead>
                    <TableHead>Concept (Short)</TableHead>
                    <TableHead>Submitted At</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">{submission.id}</TableCell>
                      <TableCell>
                        <Badge variant={submission.participationType === 'team' ? 'default' : 'secondary'}>
                          {submission.participationType}
                        </Badge>
                      </TableCell>
                      <TableCell>{submission.contactPersonName}</TableCell>
                      <TableCell>{submission.email}</TableCell>
                      <TableCell>{submission.teamName || 'N/A'}</TableCell>
                      <TableCell className="text-center">
                        {submission.participationType === 'team' ? submission.teamMemberCount + 1 : 1}
                      </TableCell>
                      <TableCell title={submission.concept}>
                        {submission.concept.length > 50 ? `${submission.concept.substring(0, 50)}...` : submission.concept}
                      </TableCell>
                      <TableCell>
                        {format(new Date(submission.submissionTimestamp), 'PPpp')}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button variant="ghost" size="sm" onClick={() => handleViewSubmission(submission)}>
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {selectedSubmission && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Submission Details - ID: {selectedSubmission.id}</DialogTitle>
              <DialogDescription>
                Detailed information for submission by {selectedSubmission.contactPersonName}.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[70vh] pr-4">
              <div className="grid gap-4 py-4 text-sm">
                <div className="grid grid-cols-[150px_1fr] items-center gap-2">
                  <span className="font-semibold text-muted-foreground">Participation Type:</span>
                  <Badge variant={selectedSubmission.participationType === 'team' ? 'default' : 'secondary'}>
                    {selectedSubmission.participationType}
                  </Badge>
                </div>

                <div className="grid grid-cols-[150px_1fr] items-center gap-2">
                  <span className="font-semibold text-muted-foreground">
                    {selectedSubmission.participationType === 'team' ? 'Team Lead Name:' : 'Contact Name:'}
                  </span>
                  <span>{selectedSubmission.contactPersonName}</span>
                </div>
                <div className="grid grid-cols-[150px_1fr] items-center gap-2">
                  <span className="font-semibold text-muted-foreground">
                    {selectedSubmission.participationType === 'team' ? 'Team Lead Email:' : 'Contact Email:'}
                  </span>
                  <a href={`mailto:${selectedSubmission.email}`} className="text-primary hover:underline">{selectedSubmission.email}</a>
                </div>
                <div className="grid grid-cols-[150px_1fr] items-center gap-2">
                  <span className="font-semibold text-muted-foreground">
                    {selectedSubmission.participationType === 'team' ? 'Team Lead Mobile:' : 'Contact Mobile:'}
                  </span>
                  <span>{selectedSubmission.mobileNumber}</span>
                </div>

                {selectedSubmission.participationType === 'team' && (
                  <>
                    {selectedSubmission.teamName && (
                      <div className="grid grid-cols-[150px_1fr] items-center gap-2">
                        <span className="font-semibold text-muted-foreground">Team Name:</span>
                        <span>{selectedSubmission.teamName}</span>
                      </div>
                    )}
                    <div className="grid grid-cols-[150px_1fr] items-start gap-2">
                      <span className="font-semibold text-muted-foreground mt-1">Total Team Size:</span>
                      <span>{selectedSubmission.teamMemberCount + 1}</span>
                    </div>
                    {(selectedSubmission.teamMembers && selectedSubmission.teamMembers.length > 0) && (
                      <div className="mt-2 pt-2 border-t">
                        <h4 className="font-semibold text-muted-foreground mb-2">Additional Team Members:</h4>
                        <div className="space-y-2 pl-4">
                          {selectedSubmission.teamMembers.map((member, index) => (
                            <div key={index} className="p-2 rounded-md border bg-muted/30">
                              <p><strong>Name:</strong> {member.name}</p>
                              <p><strong>Email:</strong> <a href={`mailto:${member.email}`} className="text-primary hover:underline">{member.email}</a></p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                <Separator className="my-3" />

                <div>
                  <h4 className="font-semibold text-muted-foreground mb-2">Concept:</h4>
                  <p className="whitespace-pre-wrap bg-muted/50 p-3 rounded-md">{selectedSubmission.concept}</p>
                </div>
                <div className="mt-2 pt-2 border-t">
                  <h4 className="font-semibold text-muted-foreground mb-2">Objective:</h4>
                  <p className="whitespace-pre-wrap bg-muted/50 p-3 rounded-md">{selectedSubmission.objective}</p>
                </div>
                <div className="mt-2 pt-2 border-t">
                  <h4 className="font-semibold text-muted-foreground mb-2">Requirements:</h4>
                  <p className="whitespace-pre-wrap bg-muted/50 p-3 rounded-md">{selectedSubmission.requirements}</p>
                </div>
                <div className="mt-2 pt-2 border-t">
                  <h4 className="font-semibold text-muted-foreground mb-2">Technical Applications:</h4>
                  <p className="whitespace-pre-wrap bg-muted/50 p-3 rounded-md">{selectedSubmission.technicalApplications}</p>
                </div>

                <Separator className="my-3" />

                <div className="grid grid-cols-[150px_1fr] items-center gap-2">
                  <span className="font-semibold text-muted-foreground">Slides Link:</span>
                  <a href={selectedSubmission.slidesLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
                    {selectedSubmission.slidesLink}
                  </a>
                </div>
                <div className="grid grid-cols-[150px_1fr] items-center gap-2">
                  <span className="font-semibold text-muted-foreground">Submitted At:</span>
                  <span>{format(new Date(selectedSubmission.submissionTimestamp), 'PPPppp')}</span>
                </div>
              </div>
            </ScrollArea>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
