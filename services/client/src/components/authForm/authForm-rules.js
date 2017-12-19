export const signupRules = [
  {
    id: 1,
    field: 'username',
    message: 'Username must be greater than 5 characters.',
    valid: false
  },
  {
    id: 2,
    field: 'email',
    message: 'Email must be greater than 5 characters.',
    valid: false
  },
  {
    id: 3,
    field: 'email',
    message: 'Email must be a valid email address.',
    valid: false
  },
  {
    id: 4,
    field: 'password',
    message: 'Password must be greater than 10 characters.',
    valid: false
  }
];

export const signinRules = [
  {
    id: 1,
    field: 'email',
    message: 'Email is required.',
    valid: false
  },
  {
    id: 2,
    field: 'password',
    message: 'Password is required.',
    valid: false
  }
];
