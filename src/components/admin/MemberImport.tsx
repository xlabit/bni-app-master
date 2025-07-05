
import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Upload, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCreateMember } from '@/hooks/useMembers';
import { useChapters } from '@/hooks/useChapters';
import * as XLSX from 'xlsx';
import { Member } from '@/types';

interface MemberImportProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: () => void;
}

interface ImportRow {
  name: string;
  email: string;
  businessName: string;
  phone: string;
  chapterName: string;
  memberRole: Member['memberRole'];
  membershipEndDate: string;
  status: 'active' | 'inactive';
}

interface ImportResult {
  success: number;
  failed: number;
  errors: string[];
}

export const MemberImport: React.FC<MemberImportProps> = ({
  isOpen,
  onClose,
  onImportComplete
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const createMemberMutation = useCreateMember();
  const { data: chapters = [] } = useChapters();

  const downloadTemplate = () => {
    const templateData = [
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
        businessName: 'Doe Enterprises',
        phone: '+1-555-0123',
        chapterName: 'Downtown Chapter',
        memberRole: 'regular',
        membershipEndDate: '2024-12-31',
        status: 'active'
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Members Template');
    
    // Set column widths
    worksheet['!cols'] = [
      { width: 20 }, // name
      { width: 25 }, // email
      { width: 20 }, // businessName
      { width: 15 }, // phone
      { width: 20 }, // chapterName
      { width: 15 }, // memberRole
      { width: 18 }, // membershipEndDate
      { width: 10 }  // status
    ];

    XLSX.writeFile(workbook, 'member_import_template.xlsx');
    
    toast({
      title: "Template downloaded",
      description: "Excel template has been downloaded successfully.",
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && 
          selectedFile.type !== 'application/vnd.ms-excel') {
        toast({
          title: "Invalid file type",
          description: "Please select an Excel file (.xlsx or .xls)",
          variant: "destructive",
        });
        return;
      }
      setFile(selectedFile);
      setResult(null);
    }
  };

  const validateRow = (row: any, rowIndex: number): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    const rowNum = rowIndex + 2; // +2 because Excel rows start at 1 and we have a header

    if (!row.name || typeof row.name !== 'string' || row.name.trim().length < 2) {
      errors.push(`Row ${rowNum}: Name is required and must be at least 2 characters`);
    }

    if (!row.email || typeof row.email !== 'string' || !/^\S+@\S+$/i.test(row.email)) {
      errors.push(`Row ${rowNum}: Valid email is required`);
    }

    if (!row.businessName || typeof row.businessName !== 'string' || row.businessName.trim().length === 0) {
      errors.push(`Row ${rowNum}: Business name is required`);
    }

    if (!row.phone || typeof row.phone !== 'string' || !/^[\d\s\-\+\(\)]+$/.test(row.phone)) {
      errors.push(`Row ${rowNum}: Valid phone number is required`);
    }

    if (!row.chapterName || !chapters.find(c => c.name === row.chapterName)) {
      errors.push(`Row ${rowNum}: Valid chapter name is required. Available chapters: ${chapters.map(c => c.name).join(', ')}`);
    }

    const validRoles = ['regular', 'leadership', 'ro', 'green', 'gold'];
    if (!row.memberRole || !validRoles.includes(row.memberRole)) {
      errors.push(`Row ${rowNum}: Member role must be one of: ${validRoles.join(', ')}`);
    }

    if (!row.membershipEndDate || isNaN(Date.parse(row.membershipEndDate))) {
      errors.push(`Row ${rowNum}: Valid membership end date is required (YYYY-MM-DD format)`);
    }

    const validStatuses = ['active', 'inactive'];
    if (!row.status || !validStatuses.includes(row.status)) {
      errors.push(`Row ${rowNum}: Status must be either 'active' or 'inactive'`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const importMembers = async () => {
    if (!file) return;

    setImporting(true);
    setProgress(0);
    setResult(null);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as ImportRow[];

      if (jsonData.length === 0) {
        throw new Error('Excel file is empty or has no valid data');
      }

      const result: ImportResult = {
        success: 0,
        failed: 0,
        errors: []
      };

      // Validate all rows first
      const validRows: ImportRow[] = [];
      jsonData.forEach((row, index) => {
        const validation = validateRow(row, index);
        if (validation.isValid) {
          validRows.push(row);
        } else {
          result.failed++;
          result.errors.push(...validation.errors);
        }
      });

      // Import valid rows
      for (let i = 0; i < validRows.length; i++) {
        const row = validRows[i];
        try {
          await createMemberMutation.mutateAsync({
            name: row.name.trim(),
            email: row.email.trim(),
            businessName: row.businessName.trim(),
            phone: row.phone.trim(),
            chapterName: row.chapterName.trim(),
            memberRole: row.memberRole,
            membershipEndDate: row.membershipEndDate,
            status: row.status
          });
          result.success++;
        } catch (error) {
          result.failed++;
          result.errors.push(`Failed to import ${row.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        
        setProgress(((i + 1) / validRows.length) * 100);
      }

      setResult(result);
      
      if (result.success > 0) {
        toast({
          title: "Import completed",
          description: `Successfully imported ${result.success} members${result.failed > 0 ? ` (${result.failed} failed)` : ''}.`,
        });
        onImportComplete();
      }

    } catch (error) {
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setResult(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5" />
            Import Members
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Download Template */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="font-medium mb-2">Step 1: Download Template</h4>
            <p className="text-sm text-gray-600 mb-3">
              Download the Excel template to ensure your data is formatted correctly.
            </p>
            <Button onClick={downloadTemplate} variant="outline" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Download Excel Template
            </Button>
          </div>

          {/* Upload File */}
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-2">Step 2: Upload File</h4>
            <div className="space-y-2">
              <Label htmlFor="file">Select Excel file (.xlsx or .xls)</Label>
              <Input
                id="file"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                ref={fileInputRef}
                disabled={importing}
              />
              {file && (
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  {file.name} selected
                </p>
              )}
            </div>
          </div>

          {/* Import Progress */}
          {importing && (
            <div className="space-y-2">
              <Label>Import Progress</Label>
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-gray-600">{Math.round(progress)}% complete</p>
            </div>
          )}

          {/* Import Results */}
          {result && (
            <div className="space-y-2">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    <p><strong>Import Results:</strong></p>
                    <p>✅ Successfully imported: {result.success} members</p>
                    {result.failed > 0 && (
                      <>
                        <p>❌ Failed to import: {result.failed} members</p>
                        {result.errors.length > 0 && (
                          <div className="mt-2 max-h-32 overflow-y-auto">
                            <p className="font-medium text-sm">Errors:</p>
                            <ul className="text-xs space-y-1 ml-2">
                              {result.errors.slice(0, 10).map((error, index) => (
                                <li key={index}>• {error}</li>
                              ))}
                              {result.errors.length > 10 && (
                                <li>• ... and {result.errors.length - 10} more errors</li>
                              )}
                            </ul>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={handleClose}>
              {result ? 'Close' : 'Cancel'}
            </Button>
            {!result && (
              <Button 
                onClick={importMembers} 
                disabled={!file || importing}
                className="gap-2"
              >
                <Upload className="w-4 h-4" />
                {importing ? 'Importing...' : 'Import Members'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
