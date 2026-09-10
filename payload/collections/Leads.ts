import type { CollectionConfig } from "payload";

/** Submissions from the contact form. `create` is deliberately public — the
 *  form posts here straight from the browser with no session — while reading
 *  and editing stay behind an admin login. */
export const Leads: CollectionConfig = {
  slug: "leads",
  labels: { singular: "Contact Enquiry", plural: "Contact Enquiries" },
  admin: {
    group: "Enquiries",
    useAsTitle: "name",
    defaultColumns: ["name", "email", "company", "createdAt"],
    description: "Everyone who has submitted the contact form. Newest first.",
  },
  access: {
    create: () => true,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  trash: true,
  defaultSort: "-createdAt",
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation !== "create") return data;
        // A single display name saves the admin list from needing two columns
        // to identify a person.
        const name = [data.firstName, data.lastName].filter(Boolean).join(" ").trim();
        return { ...data, name: name || data.email || "Unnamed enquiry" };
      },
    ],
  },
  fields: [
    { name: "name", type: "text", label: "Name", admin: { readOnly: true } },
    { name: "firstName", type: "text", label: "First Name", required: true },
    { name: "lastName", type: "text", label: "Last Name" },
    { name: "email", type: "email", label: "Email", required: true },
    { name: "phone", type: "text", label: "Phone" },
    { name: "company", type: "text", label: "Company" },
    { name: "role", type: "text", label: "Role" },
    { name: "message", type: "textarea", label: "Message" },
    {
      name: "handled",
      type: "checkbox",
      label: "Followed up",
      defaultValue: false,
      admin: { description: "Tick once someone has replied to this enquiry." },
    },
  ],
};
