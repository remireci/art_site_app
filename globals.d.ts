// This tells the editor that any file ending in .css is a valid module
declare module "*.css" {
  const content: any;
  export default content;
}
