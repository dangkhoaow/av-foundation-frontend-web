type FontOptions = {
  subsets?: string[];
  display?: string;
  variable?: string;
};

const createFont = (options?: FontOptions) => {
  const variable = options?.variable || '';
  return {
    className: variable,
    variable,
  };
};

export const Inter = (options?: FontOptions) => createFont(options);
