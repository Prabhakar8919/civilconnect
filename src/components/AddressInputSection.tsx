import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AddressFields } from "@/lib/addressUtils";

interface AddressInputSectionProps {
  address: Partial<AddressFields>;
  onChange: (field: keyof AddressFields, value: string) => void;
  required?: boolean;
  idPrefix?: string;
}

export const AddressInputSection = ({ 
  address, 
  onChange, 
  required = false,
  idPrefix = ""
}: AddressInputSectionProps) => {
  return (
    <div className="space-y-6">
      {/* Row 1: House Number & Plot Number */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label htmlFor={`${idPrefix}house_number`} className="text-base font-bold text-slate-900 dark:text-slate-50">
            House Number
          </Label>
          <Input
            id={`${idPrefix}house_number`}
            value={address.house_number || ''}
            onChange={(e) => onChange('house_number', e.target.value)}
            placeholder="e.g., 12-34"
            className="h-12 text-base border-2 border-slate-300 dark:border-slate-600 focus:border-primary dark:focus:border-primary bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50"
          />
        </div>
        <div className="space-y-3">
          <Label htmlFor={`${idPrefix}plot_number`} className="text-base font-bold text-slate-900 dark:text-slate-50">
            Plot Number
          </Label>
          <Input
            id={`${idPrefix}plot_number`}
            value={address.plot_number || ''}
            onChange={(e) => onChange('plot_number', e.target.value)}
            placeholder="e.g., 567"
            className="h-12 text-base border-2 border-slate-300 dark:border-slate-600 focus:border-primary dark:focus:border-primary bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50"
          />
        </div>
      </div>

      {/* Row 2: Street & Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label htmlFor={`${idPrefix}street`} className="text-base font-bold text-slate-900 dark:text-slate-50">
            Street
          </Label>
          <Input
            id={`${idPrefix}street`}
            value={address.street || ''}
            onChange={(e) => onChange('street', e.target.value)}
            placeholder="e.g., MG Road"
            className="h-12 text-base border-2 border-slate-300 dark:border-slate-600 focus:border-primary dark:focus:border-primary bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50"
          />
        </div>
        <div className="space-y-3">
          <Label htmlFor={`${idPrefix}area`} className="text-base font-bold text-slate-900 dark:text-slate-50">
            Area
          </Label>
          <Input
            id={`${idPrefix}area`}
            value={address.area || ''}
            onChange={(e) => onChange('area', e.target.value)}
            placeholder="e.g., Jubilee Hills"
            className="h-12 text-base border-2 border-slate-300 dark:border-slate-600 focus:border-primary dark:focus:border-primary bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50"
          />
        </div>
      </div>

      {/* Row 3: Village & Mandal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label htmlFor={`${idPrefix}village`} className="text-base font-bold text-slate-900 dark:text-slate-50">
            Village
          </Label>
          <Input
            id={`${idPrefix}village`}
            value={address.village || ''}
            onChange={(e) => onChange('village', e.target.value)}
            placeholder="e.g., Gachibowli"
            className="h-12 text-base border-2 border-slate-300 dark:border-slate-600 focus:border-primary dark:focus:border-primary bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50"
          />
        </div>
        <div className="space-y-3">
          <Label htmlFor={`${idPrefix}mandal`} className="text-base font-bold text-slate-900 dark:text-slate-50">
            Mandal
          </Label>
          <Input
            id={`${idPrefix}mandal`}
            value={address.mandal || ''}
            onChange={(e) => onChange('mandal', e.target.value)}
            placeholder="e.g., Serilingampally"
            className="h-12 text-base border-2 border-slate-300 dark:border-slate-600 focus:border-primary dark:focus:border-primary bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50"
          />
        </div>
      </div>

      {/* Row 4: District, City & State */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-3">
          <Label htmlFor={`${idPrefix}district`} className="text-base font-bold text-slate-900 dark:text-slate-50">
            District
          </Label>
          <Input
            id={`${idPrefix}district`}
            value={address.district || ''}
            onChange={(e) => onChange('district', e.target.value)}
            placeholder="e.g., Rangareddy"
            className="h-12 text-base border-2 border-slate-300 dark:border-slate-600 focus:border-primary dark:focus:border-primary bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50"
          />
        </div>
        <div className="space-y-3">
          <Label htmlFor={`${idPrefix}city`} className="text-base font-bold text-slate-900 dark:text-slate-50">
            City {required && <span className="text-red-600 dark:text-red-400">*</span>}
          </Label>
          <Input
            id={`${idPrefix}city`}
            value={address.city || ''}
            onChange={(e) => onChange('city', e.target.value)}
            placeholder="e.g., Hyderabad"
            required={required}
            className="h-12 text-base border-2 border-slate-300 dark:border-slate-600 focus:border-primary dark:focus:border-primary bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50"
          />
        </div>
        <div className="space-y-3">
          <Label htmlFor={`${idPrefix}state`} className="text-base font-bold text-slate-900 dark:text-slate-50">
            State {required && <span className="text-red-600 dark:text-red-400">*</span>}
          </Label>
          <Input
            id={`${idPrefix}state`}
            value={address.state || ''}
            onChange={(e) => onChange('state', e.target.value)}
            placeholder="e.g., Telangana"
            required={required}
            className="h-12 text-base border-2 border-slate-300 dark:border-slate-600 focus:border-primary dark:focus:border-primary bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50"
          />
        </div>
      </div>
    </div>
  );
};
