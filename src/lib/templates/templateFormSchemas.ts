import { FormSchema } from '@/utils/schemas/formSchema'
import { onboardingPmSchema } from './onboarding-pm'
import { onboardingPfSchema } from './onboarding-pf'

export const templateFormSchemas: Record<string, FormSchema> = {
  'onboarding-pm': onboardingPmSchema,
  'onboarding-pf': onboardingPfSchema,
}
