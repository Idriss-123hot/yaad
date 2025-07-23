import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Languages } from 'lucide-react';

const LANGUAGES = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'ar-MA', name: 'العربية المغربية', flag: '🇲🇦' }
];

interface TranslationField {
  name: string;
  label: string;
  type: 'input' | 'textarea';
  required?: boolean;
  rows?: number;
}

interface TranslationFormProps {
  title: string;
  description?: string;
  fields: TranslationField[];
  values: Record<string, Record<string, string>>;
  onChange: (locale: string, field: string, value: string) => void;
}

export function TranslationForm({ title, description, fields, values, onChange }: TranslationFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Languages className="h-5 w-5" />
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="fr" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            {LANGUAGES.map(lang => (
              <TabsTrigger key={lang.code} value={lang.code} className="flex items-center gap-2">
                <span>{lang.flag}</span>
                <span className="hidden sm:inline">{lang.name}</span>
                <span className="sm:hidden">{lang.code.toUpperCase()}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {LANGUAGES.map(lang => (
            <TabsContent key={lang.code} value={lang.code} className="space-y-4 mt-4">
              {fields.map(field => (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={`${field.name}-${lang.code}`}>
                    {field.label}
                    {field.required && lang.code === 'fr' && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  {field.type === 'input' ? (
                    <Input
                      id={`${field.name}-${lang.code}`}
                      value={values[lang.code]?.[field.name] || ''}
                      onChange={(e) => onChange(lang.code, field.name, e.target.value)}
                      placeholder={`${field.label} en ${lang.name}`}
                    />
                  ) : (
                    <Textarea
                      id={`${field.name}-${lang.code}`}
                      value={values[lang.code]?.[field.name] || ''}
                      onChange={(e) => onChange(lang.code, field.name, e.target.value)}
                      placeholder={`${field.label} en ${lang.name}`}
                      rows={field.rows || 3}
                    />
                  )}
                </div>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}