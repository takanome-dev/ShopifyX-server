"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// keystone.ts
var keystone_exports = {};
__export(keystone_exports, {
  default: () => keystone_default
});
module.exports = __toCommonJS(keystone_exports);
var import_config = require("dotenv/config");
var import_core5 = require("@keystone-6/core");

// schemas/CartItem.ts
var import_fields = require("@keystone-6/core/fields");
var import_core = require("@keystone-6/core");
var CartItem = (0, import_core.list)({
  fields: {
    product: (0, import_fields.relationship)({
      ref: "Product"
    }),
    user: (0, import_fields.relationship)({
      ref: "User.cart",
      many: false
    }),
    quantity: (0, import_fields.integer)({ validation: { min: 1, isRequired: true } })
  },
  ui: {
    listView: {
      initialColumns: ["id", "product", "quantity", "user"]
    }
  }
});

// schemas/ProductImage.ts
var import_fields2 = require("@keystone-6/core/fields");
var import_cloudinary = require("@keystone-6/cloudinary");
var import_core2 = require("@keystone-6/core");
var ProductImage = (0, import_core2.list)({
  fields: {
    image: (0, import_cloudinary.cloudinaryImage)({
      cloudinary: {
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        folder: "takanome_sickfits"
      },
      label: "Source"
    }),
    altText: (0, import_fields2.text)(),
    product: (0, import_fields2.relationship)({
      ref: "Product.photo",
      many: false
    })
  },
  ui: {
    listView: {
      initialColumns: ["altText", "image", "product"]
    }
  }
});

// schemas/Product.ts
var import_fields3 = require("@keystone-6/core/fields");
var import_core3 = require("@keystone-6/core");
var Product = (0, import_core3.list)({
  fields: {
    name: (0, import_fields3.text)({ validation: { isRequired: true } }),
    description: (0, import_fields3.text)({
      validation: { isRequired: true },
      ui: {
        displayMode: "textarea"
      }
    }),
    price: (0, import_fields3.integer)({ validation: { min: 1 } }),
    stock: (0, import_fields3.integer)(),
    createdBy: (0, import_fields3.relationship)({
      ref: "User",
      many: false
    }),
    createdAt: (0, import_fields3.timestamp)({
      defaultValue: {
        kind: "now"
      }
    }),
    updatedAt: (0, import_fields3.timestamp)(),
    status: (0, import_fields3.select)({
      options: [
        { label: "Available", value: "AVAILABLE" },
        { label: "Unavailable", value: "UNAVAILABLE" },
        { label: "Draft", value: "DRAFT" }
      ],
      defaultValue: "DRAFT",
      ui: {
        displayMode: "segmented-control",
        createView: { fieldMode: "hidden" }
      }
    }),
    photo: (0, import_fields3.relationship)({
      ref: "ProductImage.product",
      ui: {
        displayMode: "cards",
        cardFields: ["image", "altText"],
        inlineCreate: {
          fields: ["image", "altText"]
        },
        inlineEdit: { fields: ["image", "altText"] }
      }
    })
  }
});

// schemas/User.ts
var import_core4 = require("@keystone-6/core");
var import_fields4 = require("@keystone-6/core/fields");
var User = (0, import_core4.list)({
  fields: {
    username: (0, import_fields4.text)({ validation: { isRequired: true } }),
    email: (0, import_fields4.text)({ validation: { isRequired: true }, isIndexed: "unique" }),
    password: (0, import_fields4.password)({ validation: { isRequired: true } }),
    cart: (0, import_fields4.relationship)({
      ref: "CartItem.user",
      many: true,
      ui: {
        listView: { fieldMode: "hidden" },
        itemView: { fieldMode: "read" }
      }
    })
  },
  ui: {
    listView: {
      initialColumns: ["id", "username", "email", "cart"]
    }
  }
});

// schemas/index.ts
var lists = {
  User,
  Product,
  ProductImage,
  CartItem
};

// auth.ts
var import_auth = require("@keystone-6/auth");
var import_session = require("@keystone-6/core/session");

// lib/mail.ts
var import_nodemailer = __toESM(require("nodemailer"));
var import_path = __toESM(require("path"));
var import_nodemailer_express_handlebars = __toESM(require("nodemailer-express-handlebars"));
async function sendMail(user, token) {
  const transporter = import_nodemailer.default.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: process.env.ETHEREAL_EMAIL,
      pass: process.env.ETHEREAL_PASSWORD
    },
    logger: true
  });
  transporter.use(
    "compile",
    (0, import_nodemailer_express_handlebars.default)({
      viewEngine: {
        extname: ".hbs",
        partialsDir: import_path.default.resolve("emails"),
        defaultLayout: import_path.default.resolve("emails/layouts/main")
      },
      extName: ".hbs",
      viewPath: import_path.default.resolve("emails")
    })
  );
  await transporter.sendMail({
    from: "TAKANOME DEV <takanome@gmail.com>",
    to: process.env.ETHEREAL_EMAIL,
    subject: "Reset Your Password",
    template: "reset",
    context: {
      token,
      name: user.username,
      url: `${process.env.FRONTEND_URL}/reset-password?email=${user.email}&token=${token}`
    }
  });
  console.log(`\u{1F4EB} email sent to ${user.email}`);
}

// auth.ts
var sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "The SESSION_SECRET environment variable must be set in production"
    );
  } else {
    sessionSecret = "-- DEV COOKIE SECRET; CHANGE ME --";
  }
}
var { withAuth } = (0, import_auth.createAuth)({
  listKey: "User",
  identityField: "email",
  sessionData: "username",
  secretField: "password",
  initFirstItem: {
    fields: ["username", "email", "password"]
  },
  passwordResetLink: {
    sendToken: async ({ itemId, token, context }) => {
      const user = await context.query.User.findOne({
        where: { id: itemId }
      });
      sendMail(user, token);
    }
  }
});
var sessionMaxAge = 60 * 60 * 24 * 30;
var session = (0, import_session.statelessSessions)({
  maxAge: sessionMaxAge,
  secret: sessionSecret
});

// seed-data/data.ts
function timestamp2() {
  const stampy = Date.now() - Math.floor(Math.random() * 1e3 * 60 * 60 * 24 * 30);
  return new Date(stampy).toISOString();
}
var products = [
  {
    name: "Yeti Hondo",
    description: "soo nice",
    status: "AVAILABLE",
    price: 3423,
    stock: 7,
    photo: {
      id: "5dfbed262849d7961377c2c0",
      filename: "hondo.jpg",
      originalFilename: "hondo.jpg",
      mimetype: "image/jpeg",
      encoding: "7bit",
      _meta: {
        public_id: "sick-fits-keystone/5dfbed262849d7961377c2c0",
        version: 1576791335,
        signature: "9f7d5115788b7677307a39214f9684dd827ea5f9",
        width: 750,
        height: 457,
        format: "jpg",
        resource_type: "image",
        created_at: timestamp2(),
        tags: [],
        bytes: 27871,
        type: "upload",
        etag: "e1fdf84d5126b6ca2e1c8ef9532be5a5",
        placeholder: false,
        url: "http://res.cloudinary.com/wesbos/image/upload/v1576791335/sick-fits-keystone/5dfbed262849d7961377c2c0.jpg",
        secure_url: "https://res.cloudinary.com/wesbos/image/upload/v1576791335/sick-fits-keystone/5dfbed262849d7961377c2c0.jpg",
        original_filename: "file"
      }
    },
    createdById: "cl9bk2gkr0065jen5g2ukn25e",
    updatedAt: "2020-12-19T21:35:35.739Z",
    createdAt: "2020-12-19T21:35:35.739Z"
  },
  {
    name: "Airmax 270",
    description: "Great shoes!",
    status: "AVAILABLE",
    price: 5234,
    stock: 4,
    photo: {
      id: "5e2a13f0689b2835ae71d1a5",
      filename: "270-camo-sunset.jpg",
      originalFilename: "270-camo-sunset.jpg",
      mimetype: "image/jpeg",
      encoding: "7bit",
      _meta: {
        public_id: "sick-fits-keystone/5e2a13f0689b2835ae71d1a5",
        version: 1579815920,
        signature: "a430b2d35f6a03dc562f6f56a474deb6810e393f",
        width: 960,
        height: 640,
        format: "jpg",
        resource_type: "image",
        created_at: timestamp2(),
        tags: [],
        bytes: 45455,
        type: "upload",
        etag: "aebe8e9cc98ee4ad71682f19af85745b",
        placeholder: false,
        url: "http://res.cloudinary.com/wesbos/image/upload/v1579815920/sick-fits-keystone/5e2a13f0689b2835ae71d1a5.jpg",
        secure_url: "https://res.cloudinary.com/wesbos/image/upload/v1579815920/sick-fits-keystone/5e2a13f0689b2835ae71d1a5.jpg",
        original_filename: "file"
      }
    },
    createdById: "cl9bk2gkr0065jen5g2ukn25e",
    updatedAt: "2020-01-23T21:45:20.833Z",
    createdAt: "2020-01-23T21:45:20.833Z"
  },
  {
    name: "KITH Hoodie",
    description: "Love this hoodie",
    status: "AVAILABLE",
    price: 23562,
    stock: 5,
    photo: {
      id: "5e2a13ff689b2835ae71d1a7",
      filename: "kith-hoodie.jpg",
      originalFilename: "kith-hoodie.jpg",
      mimetype: "image/jpeg",
      encoding: "7bit",
      _meta: {
        public_id: "sick-fits-keystone/5e2a13ff689b2835ae71d1a7",
        version: 1579815935,
        signature: "360df116020320a14845cf235b87a4a5cdc23f86",
        width: 2e3,
        height: 2e3,
        format: "jpg",
        resource_type: "image",
        created_at: timestamp2(),
        tags: [],
        bytes: 202924,
        type: "upload",
        etag: "b6fbc18b196c68e2b87f51539b849e70",
        placeholder: false,
        url: "http://res.cloudinary.com/wesbos/image/upload/v1579815935/sick-fits-keystone/5e2a13ff689b2835ae71d1a7.jpg",
        secure_url: "https://res.cloudinary.com/wesbos/image/upload/v1579815935/sick-fits-keystone/5e2a13ff689b2835ae71d1a7.jpg",
        original_filename: "file"
      }
    },
    createdById: "cl9bk2gkr0065jen5g2ukn25e",
    updatedAt: "2020-01-23T21:45:36.012Z",
    createdAt: "2020-01-23T21:45:36.012Z"
  },
  {
    name: "Fanorak",
    description: "Super hip. Comes in a number of colours",
    status: "AVAILABLE",
    price: 252342,
    stock: 6,
    photo: {
      id: "5e2a1413689b2835ae71d1a9",
      filename: "TNF-fanorak.png",
      originalFilename: "TNF-fanorak.png",
      mimetype: "image/png",
      encoding: "7bit",
      _meta: {
        public_id: "sick-fits-keystone/5e2a1413689b2835ae71d1a9",
        version: 1579815957,
        signature: "affd16fa20107a4d5399aab553ea77fff1c4b2ef",
        width: 1276,
        height: 1490,
        format: "png",
        resource_type: "image",
        created_at: timestamp2(),
        tags: [],
        bytes: 2454948,
        type: "upload",
        etag: "ce0f36da93c60c5d4406657225206f70",
        placeholder: false,
        url: "http://res.cloudinary.com/wesbos/image/upload/v1579815957/sick-fits-keystone/5e2a1413689b2835ae71d1a9.png",
        secure_url: "https://res.cloudinary.com/wesbos/image/upload/v1579815957/sick-fits-keystone/5e2a1413689b2835ae71d1a9.png",
        original_filename: "file"
      }
    },
    createdById: "cl9bk2gkr0065jen5g2ukn25e",
    updatedAt: "2020-01-23T21:45:58.336Z",
    createdAt: "2020-01-23T21:45:58.336Z"
  },
  {
    name: "Nike Vapormax",
    description: "Kind of squeaky on some floors",
    status: "AVAILABLE",
    price: 83456,
    stock: 3,
    photo: {
      id: "5e2a142c689b2835ae71d1ab",
      filename: "vapormax.jpg",
      originalFilename: "vapormax.jpg",
      mimetype: "image/jpeg",
      encoding: "7bit",
      _meta: {
        public_id: "sick-fits-keystone/5e2a142c689b2835ae71d1ab",
        version: 1579815980,
        signature: "6dd95447407c06ba955164c4961bd4abc2fb9f4d",
        width: 1100,
        height: 735,
        format: "jpg",
        resource_type: "image",
        created_at: timestamp2(),
        tags: [],
        bytes: 183071,
        type: "upload",
        etag: "5550566c7fab113ba32d85ed08f54faa",
        placeholder: false,
        url: "http://res.cloudinary.com/wesbos/image/upload/v1579815980/sick-fits-keystone/5e2a142c689b2835ae71d1ab.jpg",
        secure_url: "https://res.cloudinary.com/wesbos/image/upload/v1579815980/sick-fits-keystone/5e2a142c689b2835ae71d1ab.jpg",
        original_filename: "file"
      }
    },
    createdById: "cl9bk2gkr0065jen5g2ukn25e",
    updatedAt: "2020-01-23T21:46:21.015Z",
    createdAt: "2020-01-23T21:46:21.015Z"
  },
  {
    name: "Yeti Cooler",
    description: "Who spends this much on a cooler?!",
    status: "AVAILABLE",
    price: 75654,
    stock: 1,
    photo: {
      id: "5e2a143f689b2835ae71d1ad",
      filename: "coral-yeti.jpg",
      originalFilename: "coral-yeti.jpg",
      mimetype: "image/jpeg",
      encoding: "7bit",
      _meta: {
        public_id: "sick-fits-keystone/5e2a143f689b2835ae71d1ad",
        version: 1579815999,
        signature: "97e8f27cdbb6a736062391b9ac3a5c689bd50646",
        width: 1300,
        height: 1144,
        format: "jpg",
        resource_type: "image",
        created_at: timestamp2(),
        tags: [],
        bytes: 286643,
        type: "upload",
        etag: "3655bfd83998492b8421782db868c9df",
        placeholder: false,
        url: "http://res.cloudinary.com/wesbos/image/upload/v1579815999/sick-fits-keystone/5e2a143f689b2835ae71d1ad.jpg",
        secure_url: "https://res.cloudinary.com/wesbos/image/upload/v1579815999/sick-fits-keystone/5e2a143f689b2835ae71d1ad.jpg",
        original_filename: "file"
      }
    },
    createdById: "cl9bk2gkr0065jen5g2ukn25e",
    updatedAt: "2020-01-23T21:46:40.526Z",
    createdAt: "2020-01-23T21:46:40.526Z"
  },
  {
    name: "Naked and Famous Denim",
    description: "Japanese Denim, made in Canada",
    status: "AVAILABLE",
    price: 10924,
    stock: 5,
    photo: {
      id: "5e2a145d689b2835ae71d1af",
      filename: "naked-and-famous-denim.jpg",
      originalFilename: "naked-and-famous-denim.jpg",
      mimetype: "image/jpeg",
      encoding: "7bit",
      _meta: {
        public_id: "sick-fits-keystone/5e2a145d689b2835ae71d1af",
        version: 1579816030,
        signature: "76dec3670cc4a4c22723720bb94496a35945c626",
        width: 1024,
        height: 683,
        format: "jpg",
        resource_type: "image",
        created_at: timestamp2(),
        tags: [],
        bytes: 146817,
        type: "upload",
        etag: "3d68591332785ae5273ed43b1aa91712",
        placeholder: false,
        url: "http://res.cloudinary.com/wesbos/image/upload/v1579816030/sick-fits-keystone/5e2a145d689b2835ae71d1af.jpg",
        secure_url: "https://res.cloudinary.com/wesbos/image/upload/v1579816030/sick-fits-keystone/5e2a145d689b2835ae71d1af.jpg",
        original_filename: "file"
      }
    },
    createdById: "cl9bk2gkr0065jen5g2ukn25e",
    updatedAt: "2020-01-23T21:47:11.415Z",
    createdAt: "2020-01-23T21:47:11.415Z"
  },
  {
    name: "Rimowa Luggage",
    description: "S T E A L T H",
    status: "AVAILABLE",
    price: 47734,
    stock: 0,
    photo: {
      id: "5e2a147b689b2835ae71d1b1",
      filename: "rimowa.png",
      originalFilename: "rimowa.png",
      mimetype: "image/png",
      encoding: "7bit",
      _meta: {
        public_id: "sick-fits-keystone/5e2a147b689b2835ae71d1b1",
        version: 1579816060,
        signature: "a6161568d2d59a59e8dba9b15e705581198ea377",
        width: 800,
        height: 1004,
        format: "png",
        resource_type: "image",
        created_at: timestamp2(),
        tags: [],
        bytes: 953657,
        type: "upload",
        etag: "d89ab8ecc366bc63464a3eeef6ef3010",
        placeholder: false,
        url: "http://res.cloudinary.com/wesbos/image/upload/v1579816060/sick-fits-keystone/5e2a147b689b2835ae71d1b1.png",
        secure_url: "https://res.cloudinary.com/wesbos/image/upload/v1579816060/sick-fits-keystone/5e2a147b689b2835ae71d1b1.png",
        original_filename: "file"
      }
    },
    createdById: "cl9bk2gkr0065jen5g2ukn25e",
    updatedAt: "2020-01-23T21:47:41.358Z",
    createdAt: "2020-01-23T21:47:41.358Z"
  },
  {
    name: "Black Hole ",
    description: "Outdoorsy ",
    status: "AVAILABLE",
    price: 4534,
    stock: 3,
    photo: {
      id: "5e2a149b689b2835ae71d1b3",
      filename: "patagonia black hole.jpg",
      originalFilename: "patagonia black hole.jpg",
      mimetype: "image/jpeg",
      encoding: "7bit",
      _meta: {
        public_id: "sick-fits-keystone/5e2a149b689b2835ae71d1b3",
        version: 1579816093,
        signature: "6ac148051cb4ba0227ee49fd61fa1348ab4a9870",
        width: 2e3,
        height: 2e3,
        format: "jpg",
        resource_type: "image",
        created_at: timestamp2(),
        tags: [],
        bytes: 515360,
        type: "upload",
        etag: "8aed0984d37a3d12faa832860b29d24b",
        placeholder: false,
        url: "http://res.cloudinary.com/wesbos/image/upload/v1579816093/sick-fits-keystone/5e2a149b689b2835ae71d1b3.jpg",
        secure_url: "https://res.cloudinary.com/wesbos/image/upload/v1579816093/sick-fits-keystone/5e2a149b689b2835ae71d1b3.jpg",
        original_filename: "file"
      }
    },
    createdById: "cl9bk2gkr0065jen5g2ukn25e",
    updatedAt: "2020-01-23T21:48:13.812Z",
    createdAt: "2020-01-23T21:48:13.812Z"
  },
  {
    name: "Nudie Belt",
    description: "Sick design",
    status: "AVAILABLE",
    price: 5234,
    stock: 1,
    photo: {
      id: "5e2a14b1689b2835ae71d1b5",
      filename: "nudie-belt.jpg",
      originalFilename: "nudie-belt.jpg",
      mimetype: "image/jpeg",
      encoding: "7bit",
      _meta: {
        public_id: "sick-fits-keystone/5e2a14b1689b2835ae71d1b5",
        version: 1579816114,
        signature: "24f3ff4ae91dfcc8d1ddeb1a713215730e834be4",
        width: 650,
        height: 650,
        format: "jpg",
        resource_type: "image",
        created_at: timestamp2(),
        tags: [],
        bytes: 71291,
        type: "upload",
        etag: "3a4b97ef88c550dcd6c2d399d1bc698e",
        placeholder: false,
        url: "http://res.cloudinary.com/wesbos/image/upload/v1579816114/sick-fits-keystone/5e2a14b1689b2835ae71d1b5.jpg",
        secure_url: "https://res.cloudinary.com/wesbos/image/upload/v1579816114/sick-fits-keystone/5e2a14b1689b2835ae71d1b5.jpg",
        original_filename: "file"
      }
    },
    createdById: "cl9bk2gkr0065jen5g2ukn25e",
    updatedAt: "2020-01-23T21:48:34.398Z",
    createdAt: "2020-01-23T21:48:34.398Z"
  },
  {
    name: "Goose",
    description: "Keep warm.",
    status: "AVAILABLE",
    price: 74544,
    stock: 2,
    photo: {
      id: "5e2a14bf689b2835ae71d1b7",
      filename: "canada-goose.jpg",
      originalFilename: "canada-goose.jpg",
      mimetype: "image/jpeg",
      encoding: "7bit",
      _meta: {
        public_id: "sick-fits-keystone/5e2a14bf689b2835ae71d1b7",
        version: 1579816128,
        signature: "bebf3d817e91cdbb91768e8c9c2133a78798a317",
        width: 800,
        height: 800,
        format: "jpg",
        resource_type: "image",
        created_at: timestamp2(),
        tags: [],
        bytes: 180261,
        type: "upload",
        etag: "f9c8725f815a6873cbdc47ba3f869049",
        placeholder: false,
        url: "http://res.cloudinary.com/wesbos/image/upload/v1579816128/sick-fits-keystone/5e2a14bf689b2835ae71d1b7.jpg",
        secure_url: "https://res.cloudinary.com/wesbos/image/upload/v1579816128/sick-fits-keystone/5e2a14bf689b2835ae71d1b7.jpg",
        original_filename: "file"
      }
    },
    createdById: "cl9bk2gkr0065jen5g2ukn25e",
    updatedAt: "2020-01-23T21:48:48.633Z",
    createdAt: "2020-01-23T21:48:48.633Z"
  },
  {
    name: "Ultraboost",
    description: "blacked out",
    status: "AVAILABLE",
    price: 6344,
    stock: 5,
    photo: {
      id: "5e2a14cc689b2835ae71d1b9",
      filename: "ultra-boost.jpg",
      originalFilename: "ultra-boost.jpg",
      mimetype: "image/jpeg",
      encoding: "7bit",
      _meta: {
        public_id: "sick-fits-keystone/5e2a14cc689b2835ae71d1b9",
        version: 1579816141,
        signature: "18720c13b7f6d4fcde919dddb33d1c711a459c14",
        width: 565,
        height: 372,
        format: "jpg",
        resource_type: "image",
        created_at: timestamp2(),
        tags: [],
        bytes: 50754,
        type: "upload",
        etag: "44cf57f8218f135b82cfa5df0da92a49",
        placeholder: false,
        url: "http://res.cloudinary.com/wesbos/image/upload/v1579816141/sick-fits-keystone/5e2a14cc689b2835ae71d1b9.jpg",
        secure_url: "https://res.cloudinary.com/wesbos/image/upload/v1579816141/sick-fits-keystone/5e2a14cc689b2835ae71d1b9.jpg",
        original_filename: "file"
      }
    },
    createdById: "cl9bk2gkr0065jen5g2ukn25e",
    updatedAt: "2020-01-23T21:49:01.569Z",
    createdAt: "2020-01-23T21:49:01.569Z"
  }
];

// seed-data/index.ts
async function insertSeedData({ prisma }) {
  console.log(`\u{1F331} Inserting Seed Data: ${products.length} Products`);
  for (const product of products) {
    console.log(`\u{1F6CD}\uFE0F Adding Product: ${product.name}`);
    const { id } = await prisma.productImage.create({
      data: {
        image: product.photo,
        altText: product.description
      }
    });
    delete product.photo;
    product.photoId = id;
    await prisma.product.create({ data: product });
  }
  console.log(`\u2705 Seed Data Inserted: ${products.length} Products`);
  console.log(
    `\u{1F44B} Please start the process with \`yarn dev\` or \`npm run dev\``
  );
  process.exit();
}

// keystone.ts
var keystone_default = withAuth(
  (0, import_core5.config)({
    server: {
      cors: {
        origin: [process.env.FRONTEND_URL],
        credentials: true
      },
      healthCheck: {
        path: "/health-check",
        data: () => ({
          status: "healthy",
          timestamp: Date.now(),
          uptime: process.uptime()
        })
      }
    },
    db: {
      provider: "postgresql",
      url: process.env.DATABASE_URL,
      async onConnect(keystone) {
        if (process.argv.includes("--seed-data")) {
          await insertSeedData(keystone);
        }
      }
    },
    ui: {
      isAccessAllowed: (context) => !!context.session?.data
    },
    lists,
    session
  })
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
