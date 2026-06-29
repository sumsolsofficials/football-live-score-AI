import mongoose from 'mongoose'
const {Schema}=mongoose;

// A League is just a competition we display matches under
// e.g. "Premier League", "La Liga", "FIFA World Cup"
const leagueSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    logo: {
      type: String,
      default: "",
    },
    url:{
        type:String,
        default:""
    }
  },
  { timestamps: true }
);

export const League = mongoose.model("League", leagueSchema);