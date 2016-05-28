using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;

namespace Health.Core.EF.Extensions
{
    public static class ExtensionMethods
    {
        public static void AddOrUpdateCustom<T, TCompare>(this DbSet<T> table, Expression<Func<T, TCompare>> expression, params T[] entities) where T : class
        {
            foreach (var newEntity in entities)
            {
                var propertyName = ((MemberExpression)expression.Body).Member.Name;
                Func<T, bool> findAction = t =>
                {
                    var type = t.GetType();
                    var property = type.GetProperty(propertyName);
                    var databaseValue = property.GetValue(t);
                    var entityValue = property.GetValue(newEntity);
                    return databaseValue.Equals(entityValue);
                };

                var existingEntity = table.FirstOrDefault(findAction);
                if (existingEntity == null)
                    table.Add(newEntity);
                else
                {
                    var type = newEntity.GetType();
                    var reflectionProperties = type.GetProperties();
                    foreach (var item in reflectionProperties)
                    {
                        if (item.Name.ToLower().Equals("id"))
                            continue;
                        var property = type.GetProperty(item.Name);
                        var value = property.GetValue(newEntity);
                        property.SetValue(existingEntity, value, null);
                    }
                }
            }
        }
    }
}
