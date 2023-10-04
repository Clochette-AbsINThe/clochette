import { useState } from 'react';
import { FieldErrors, FieldValues, ResolverResult, UseFormReturn } from 'react-hook-form';

import { debounce, zxcvbn, zxcvbnOptions, ZxcvbnResult } from '@zxcvbn-ts/core';
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import * as zxcvbnFrPackage from '@zxcvbn-ts/language-fr';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

zxcvbnOptions.setOptions({
  useLevenshteinDistance: true,
  translations: zxcvbnFrPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnFrPackage.dictionary
  }
});

export function colorForPasswordValidator(score: number) {
  switch (score) {
    case 0:
      return 'bg-red-500';
    case 1:
      return 'bg-red-500';
    case 2:
      return 'bg-orange-500';
    case 3:
      return 'bg-yellow-500';
    case 4:
      return 'bg-green-500';
    default:
      return 'bg-gray-300';
  }
}

interface PasswordType extends FieldValues {
  password: string;
  passwordConfirm: string;
}

interface PasswordFormProps<TFieldValues extends PasswordType> {
  form: UseFormReturn<TFieldValues>;
}

export function passwordFormResolver(data: PasswordType): ResolverResult<PasswordType> {
  const errors: FieldErrors<PasswordType> = {};

  if (!data.password || data.password === '') {
    errors.password = {
      type: 'required',
      message: 'Le mot de passe est requis.'
    };
  }

  if (!data.passwordConfirm || data.passwordConfirm === '') {
    errors.passwordConfirm = {
      type: 'required',
      message: 'La confirmation du mot de passe est requise.'
    };
  }

  if (data.password !== data.passwordConfirm) {
    errors.passwordConfirm = {
      type: 'validate',
      message: 'Les mots de passe ne correspondent pas.'
    };
  }

  return {
    values: data,
    errors: errors
  };
}

export function PasswordForm<TFieldValues extends PasswordType>({ form: unsafeForm }: PasswordFormProps<TFieldValues>) {
  // @ts-expect-error
  const form = unsafeForm as UseFormReturn<PasswordType>;

  const [zxcvbnResult, setZxcvbnResult] = useState<ZxcvbnResult>(zxcvbn(''));

  const handlePasswordChange = () => {
    const res = zxcvbn(form.getValues('password'), [form.getValues('username'), form.getValues('firstName'), form.getValues('lastName')]);
    setZxcvbnResult(res);

    if (res.score < 4) {
      form.setError('password', {
        type: 'validate',
        message: res.feedback.warning ?? 'Votre mot de passe ne correpond pas aux critères de sécurité'
      });
    }
  };

  const debouncedZxcvbn = debounce(handlePasswordChange, 200);

  return (
    <>
      <FormField
        control={form.control}
        name='password'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mot de passe</FormLabel>
            <FormControl>
              <Input
                placeholder='••••••••••••••'
                type='password'
                {...field}
                onChange={(value) => {
                  field.onChange(value);
                  debouncedZxcvbn();
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='passwordConfirm'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Confirmation du mot de passe</FormLabel>
            <FormControl>
              <Input
                placeholder='••••••••••••••'
                type='password'
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className='flex flex-row gap-2 mt-2'>
        <div className={`w-full h-2 rounded-full ${zxcvbnResult.score > 0 ? `${colorForPasswordValidator(zxcvbnResult.score)}` : 'bg-gray-300'}`}></div>
        <div className={`w-full h-2 rounded-full ${zxcvbnResult.score > 1 ? `${colorForPasswordValidator(zxcvbnResult.score)}` : 'bg-gray-300'}`}></div>
        <div className={`w-full h-2 rounded-full ${zxcvbnResult.score > 2 ? `${colorForPasswordValidator(zxcvbnResult.score)}` : 'bg-gray-300'}`}></div>
        <div className={`w-full h-2 rounded-full ${zxcvbnResult.score > 3 ? `${colorForPasswordValidator(zxcvbnResult.score)}` : 'bg-gray-300'}`}></div>
      </div>
    </>
  );
}
