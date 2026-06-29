import mongoose from 'mongoose'
const {Schema}=mongoose;
// A single moment in the match, e.g. { minute: 23, event: "Goal - Messi" }
// Embedded directly inside Match since timeline entries never exist on their own
const timelineEventSchema = new Schema(
  {
    minute: {
      type: Number,
      required: true,
    },
    event: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

// Small embedded shape reused for both teamA and teamB
const teamSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    logo: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const matchSchema = new Schema(
  {
    leagueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "League",
      required: true,
    },
    teamA: {
      type: teamSchema,
      required: true,
    },
    teamB: {
      type: teamSchema,
      required: true,
    },
    scoreA: {
      type: Number,
      default: 0,
    },
    scoreB: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["LIVE", "UPCOMING", "FINISHED"],
      default: "LIVE",
    },
    minute: {
      type: Number,
      default: 0,
    },
    timeline: {
      type: [timelineEventSchema],
      default: [],
    },
  },
  { timestamps: true }
);

const Match = mongoose.model("Match", matchSchema);
export default Match;