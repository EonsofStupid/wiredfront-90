import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { CheckIcon, Trash } from 'lucide-react';
// Schema for form validation
const formSchema = z.object({
    key: z.string().min(3, { message: 'Key must be at least 3 characters' }).max(50).regex(/^[a-z0-9_]+$/, {
        message: 'Key can only contain lowercase letters, numbers, and underscores',
    }),
    name: z.string().min(3, { message: 'Name is required' }).max(100),
    description: z.string().max(500).optional(),
    enabled: z.boolean().default(false),
    target_roles: z.array(z.custom()).optional(),
    rollout_percentage: z.number().min(0).max(100).default(100),
});
const roleOptions = ['super_admin', 'admin', 'developer', 'subscriber', 'guest'];
export function FeatureFlagDialog({ open, onOpenChange, flag, onSubmit, onDelete, isCreating = false, isSuperAdmin }) {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            key: flag?.key || '',
            name: flag?.name || '',
            description: flag?.description || '',
            enabled: flag?.enabled || false,
            target_roles: flag?.target_roles || [],
            rollout_percentage: flag?.rollout_percentage || 100,
        },
    });
    const handleSubmit = (values) => {
        onSubmit(values);
        onOpenChange(false);
    };
    return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(DialogContent, { className: "sm:max-w-[600px]", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: isCreating ? 'Create Feature Flag' : 'Edit Feature Flag' }), _jsx(DialogDescription, { children: isCreating
                                ? 'Add a new feature flag to control feature availability within the application.'
                                : 'Modify existing feature flag settings and targeting.' })] }), _jsx(Form, { ...form, children: _jsxs("form", { onSubmit: form.handleSubmit(handleSubmit), className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsx(FormField, { control: form.control, name: "key", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Flag Key" }), _jsx(FormControl, { children: _jsx(Input, { placeholder: "example_feature", ...field, readOnly: !isCreating, className: !isCreating ? "bg-muted" : "" }) }), _jsx(FormDescription, { children: "Unique identifier used in code" }), _jsx(FormMessage, {})] })) }), _jsx(FormField, { control: form.control, name: "name", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Display Name" }), _jsx(FormControl, { children: _jsx(Input, { placeholder: "Example Feature", ...field }) }), _jsx(FormDescription, { children: "Human-readable name" }), _jsx(FormMessage, {})] })) })] }), _jsx(FormField, { control: form.control, name: "description", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Description" }), _jsx(FormControl, { children: _jsx(Textarea, { placeholder: "Describe what this feature flag controls...", className: "resize-none", ...field, value: field.value || '' }) }), _jsx(FormMessage, {})] })) }), _jsx(FormField, { control: form.control, name: "enabled", render: ({ field }) => (_jsxs(FormItem, { className: "flex flex-row items-center justify-between rounded-lg border p-4", children: [_jsxs("div", { className: "space-y-0.5", children: [_jsx(FormLabel, { className: "text-base", children: "Enabled" }), _jsx(FormDescription, { children: "Toggle this feature on or off" })] }), _jsx(FormControl, { children: _jsx(Switch, { checked: field.value, onCheckedChange: field.onChange }) })] })) }), _jsx(FormField, { control: form.control, name: "rollout_percentage", render: ({ field }) => (_jsxs(FormItem, { children: [_jsxs(FormLabel, { children: ["Rollout Percentage: ", field.value, "%"] }), _jsx(FormControl, { children: _jsx(Slider, { min: 0, max: 100, step: 1, value: [field.value], onValueChange: (vals) => field.onChange(vals[0]) }) }), _jsx(FormDescription, { children: "Percentage of users who will have this feature enabled" }), _jsx(FormMessage, {})] })) }), _jsx(FormField, { control: form.control, name: "target_roles", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Target Roles" }), _jsx("div", { className: "flex flex-wrap gap-2 mt-2", children: roleOptions.map(role => {
                                                const isSelected = field.value?.includes(role);
                                                return (_jsxs(Badge, { variant: isSelected ? "default" : "outline", className: `cursor-pointer ${isSelected ? 'bg-primary' : ''}`, onClick: () => {
                                                        const currentValues = field.value || [];
                                                        const newValue = isSelected
                                                            ? currentValues.filter(r => r !== role)
                                                            : [...currentValues, role];
                                                        field.onChange(newValue);
                                                    }, children: [isSelected && _jsx(CheckIcon, { className: "mr-1 h-3 w-3" }), role.replace('_', ' ')] }, role));
                                            }) }), _jsx(FormDescription, { children: "Leave empty to target all roles" }), _jsx(FormMessage, {})] })) }), _jsxs(DialogFooter, { className: "flex gap-2 justify-between", children: [!isCreating && isSuperAdmin && onDelete && (_jsxs(Button, { type: "button", variant: "destructive", onClick: onDelete, className: "mr-auto", children: [_jsx(Trash, { className: "h-4 w-4 mr-2" }), "Delete"] })), _jsxs("div", { children: [_jsx(Button, { type: "button", variant: "outline", onClick: () => onOpenChange(false), className: "mr-2", children: "Cancel" }), _jsx(Button, { type: "submit", children: isCreating ? 'Create' : 'Save changes' })] })] })] }) })] }) }));
}
