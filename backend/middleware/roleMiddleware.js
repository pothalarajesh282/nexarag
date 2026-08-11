const supabase = require("../config/supabase");

const requireAdmin = async (req, res, next) => {
  try {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", req.user.id)
      .single();

    if (error || !profile) {
      return res.status(403).json({
        success: false,
        message: "User profile not found",
      });
    }

    if (profile.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    req.userRole = profile.role;

    next();
  } catch (error) {
    console.error("Role authorization error:", error);

    return res.status(403).json({
      success: false,
      message: "Unable to verify user role",
    });
  }
};

module.exports = {
  requireAdmin,
};
