using System.ComponentModel;

namespace Health.Core.Next.Dtos
{
    public enum Gender
    {
        Male,
        Female,
        AttackHelicopter
    }

    public enum ActivityLevel
    {
        BasalMetabolicRate,
        [Description("Little or no exercise")]
        Sedentary,
        [Description("Exercise/sports 1-3 times/week")]
        LightlyActive,
        [Description("Exercise/sports 3-5 times/week")]
        ModeratelyActive,
        [Description("Hard exercise/sports 6-7 times/week")]
        VeryActive,
        [Description("Very hard exercise/sports or physical job")]
        ExtraActive
    }
}