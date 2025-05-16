
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns'; // For date formatting

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
  teamMemberCount: number;
}

export default function AdminSubmissionsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

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
    // Basic CSV export functionality (client-side, may not be suitable for very large datasets)
    if (submissions.length === 0) {
      toast({ title: 'No Data', description: 'No submissions to export.', variant: 'destructive' });
      return;
    }

    const headers = [
      "ID", "Participation Type", "Contact Name", "Mobile", "Email", "Team Name",
      "Team Member Count", "Concept", "Objective", "Requirements", "Tech Applications",
      "Slides Link", "Submission Timestamp"
    ];
    
    const csvRows = [
      headers.join(','),
      ...submissions.map(s => [
        s.id,
        s.participationType,
        `"${s.contactPersonName.replace(/"/g, '""')}"`,
        s.mobileNumber,
        s.email,
        s.teamName ? `"${s.teamName.replace(/"/g, '""')}"` : '',
        s.teamMemberCount,
        `"${s.concept.replace(/"/g, '""')}"`,
        `"${s.objective.replace(/"/g, '""')}"`,
        `"${s.requirements.replace(/"/g, '""')}"`,
        `"${s.technicalApplications.replace(/"/g, '""')}"`,
        s.slidesLink,
        format(new Date(s.submissionTimestamp), "yyyy-MM-dd HH:mm:ss")
      ].join(','))
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
       toast({ title: 'Export Failed', description: 'Your browser does not support this export method.', variant: 'destructive'});
    }
  };


  if (!isMounted) {
    return <div className="flex justify-center items-center min-h-screen"><Icons.RefreshCw className="h-8 w-8 animate-spin text-primary" /></div>;
  }
  if (localStorage.getItem('isAdminLoggedIn') !== 'true') {
    return null; // Will be redirected by useEffect
  }

  return (
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
                  <TableHead className="text-center">Members</TableHead>
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
                       {/* Placeholder for actions like view details */}
                       <Button variant="ghost" size="sm" onClick={() => alert(`View details for submission ID: ${submission.id}\nFull Concept: ${submission.concept}\nObjective: ${submission.objective}\nRequirements: ${submission.requirements}\nTech Apps: ${submission.technicalApplications}\nSlides: ${submission.slidesLink}\nMobile: ${submission.mobileNumber}` )}>
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
  );
}
